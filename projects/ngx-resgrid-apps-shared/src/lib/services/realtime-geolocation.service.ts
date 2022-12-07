import { Injectable, Inject } from '@angular/core';
import * as signalR from '@microsoft/signalr';
import { ResgridConfig } from '../resgrid-config';
import { Observable, Observer, Subject } from 'rxjs';
import { share } from 'rxjs/operators';
import { EventsService } from './events.service';
import { Consts } from '../consts';
import { ChannelEvent, ChannelSubject, ConnectionState } from './signalr.service';
import { AuthService } from './v4/auth.service';

@Injectable({
  providedIn: 'root',
})
export class RealtimeGeolocationService {
  private retryCount: number = 0;
  public starting$: Observable<any>;
  public connectionState$: Observable<ConnectionState>;
  public error$: Observable<string>;
  private connectionStateObserver?: Observer<ConnectionState>;
  //private connectionStateSubject = new Subject<ConnectionState>();
  private startingSubject = new Subject<any>();
  private errorSubject = new Subject<any>();

  private hubConnection?: signalR.HubConnection;
  private started: boolean = false;
  private subjects = new Array<ChannelSubject>();

  constructor(
    private config: ResgridConfig,
    private events: EventsService,
    private consts: Consts,
    private authService: AuthService
  ) {
    this.connectionState$ = new Observable<ConnectionState>((observer: any) => {
      this.connectionStateObserver = observer;
    }).pipe(share()); // share() allows multiple subscribers

    this.error$ = this.errorSubject.asObservable();
    this.starting$ = this.startingSubject.asObservable();

    //this.connectionStateObserver.next(ConnectionState.Connecting);
  }

  public start(): void {
    console.log('SignalR Channel Start()');
    this.retryCount = 0;

    if (!this.started) {
      try {
        this.connectionStateObserver?.next(ConnectionState.Connecting);
        const tokens = this.authService.retrieveTokens();

        if (tokens) {
        this.hubConnection = new signalR.HubConnectionBuilder()
          .withUrl(this.config.channelUrl + this.config.realtimeGeolocationHubName + `?access_token=${encodeURIComponent(tokens.access_token)}`)
          .configureLogging(signalR.LogLevel.Information)
          .withAutomaticReconnect()
          .build();

        // SignalR Event Listeners
        this.hubConnection.on('onPersonnelLocationUpdated', (data: any) => {
          console.log('onPersonnelLocationUpdated');
          this.events.publishEvent(
            this.consts.SIGNALR_EVENTS.PERSONNEL_LOCATION_UPDATED,
            data
          );
        });

        this.hubConnection.on('onUnitLocationUpdated', (data: any) => {
          console.log('onUnitLocationUpdated');
          this.events.publishEvent(
            this.consts.SIGNALR_EVENTS.UNIT_LOCATION_UPDATED,
            data
          );
        });

        this.hubConnection.on('onGeolocationConnect', (data: any) => {
          console.log(`onGeolocationConnect with ${data}`);
          //this.widgetPubSub.emitSignalRConnected(data);
        });

        this.hubConnection
          .start()
          .then(() => {
            console.log('Connection started');
            this.connectionStateObserver?.next(ConnectionState.Connected);

            this.hubConnection
              ?.invoke('geolocationConnect')
              .then(() => {
                console.log(
                  `Successfully subscribed to geolocationConnect channel`
                );
              })
              .catch((error: any) => {
                console.log(
                  `Error subscribed to geolocationConnect channel, ERROR: ${error}`
                );
              });

            this.started = true;
          })
          .catch((err) => {
            this.retryCount++;
            console.log('Error while starting connection: ' + err);
            this.connectionStateObserver?.next(ConnectionState.Disconnected);
            this.errorSubject.next(err);
          });
        }
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  public restart(departmentId: string): void {
    if (this.hubConnection && this.started === false) {
      try {
        this.hubConnection
          .start()
          .then(() => {
            console.log('Connection started');
            this.connectionStateObserver?.next(ConnectionState.Connected);

            this.hubConnection
              ?.invoke('geolocationConnect', parseInt(departmentId))
              .then(() => {
                console.log(
                  `Successfully subscribed to Connect channel with ${departmentId}`
                );
              })
              .catch((error: any) => {
                console.log(
                  `Error subscribed to Connect channel with ${departmentId}, ERROR: ${error}`
                );
              });

            this.started = true;
          })
          .catch((err) => {
            console.log('Error while restarting connection: ' + err);
            this.connectionStateObserver?.next(ConnectionState.Disconnected);
            
            if (this.retryCount < 10) {
              this.started = false;
            } else {
              console.log('Hub connection retry count exceeded');
              this.started = true;  // Give up
            }

            this.retryCount++;
            this.errorSubject.next(err);
          });
      } catch (ex) {
        console.log(ex);
      }
    }
  }

  public stop() {
    if (this.hubConnection) {
      this.hubConnection.stop().then(() => {
        console.log('Connection stopped');
        this.connectionStateObserver?.next(ConnectionState.Disconnected);
        this.started = false;
        this.retryCount = 0;
      })
      .catch((err) => {
        console.log('Error while starting connection: ' + err);
        this.connectionStateObserver?.next(ConnectionState.Disconnected);
        this.started = false;
        this.retryCount = 0;
        this.errorSubject.next(err);
      });
    }
  }

  /**
   * Get an observable that will contain the data associated with a specific
   * channel
   * */
  private sub(
    channel: string,
    data?: string
  ): Observable<ChannelEvent> | undefined {
    // Try to find an observable that we already created for the requested
    //  channel
    //
    let channelSub = this.subjects.find((x: ChannelSubject) => {
      return x.channel === channel;
    }) as ChannelSubject;

    // If we already have one for this event, then just return it
    //
    if (channelSub !== undefined) {
      console.log(`Found existing observable for ${channel} channel`);
      return channelSub?.subject?.asObservable();
    }

    //
    // If we're here then we don't already have the observable to provide the
    //  caller, so we need to call the server method to join the channel
    //  and then create an observable that the caller can use to received
    //  messages.
    //

    // Now we just create our internal object so we can track this subject
    //  in case someone else wants it too
    //
    channelSub = new ChannelSubject();
    channelSub.channel = channel;
    channelSub.subject = new Subject<ChannelEvent>();
    this.subjects.push(channelSub);

    // Now SignalR is asynchronous, so we need to ensure the connection is
    //  established before we call any server methods. So we'll subscribe to
    //  the starting$ stream since that won't emit a value until the connection
    //  is ready
    //
    this.starting$.subscribe(
      () => {
        this.hubConnection
          ?.invoke(channel, data)
          .then(() =>
            console.log(
              `Successfully subscribed to ${channel} channel with ${data}`
            )
          )
          .catch((err) => channelSub?.subject?.error(err));
      },
      (error: any) => {
        channelSub?.subject?.error(error);
      }
    );

    return channelSub.subject.asObservable();
  }

  // Not quite sure how to handle this (if at all) since there could be
  //  more than 1 caller subscribed to an observable we created
  //
  // unsubscribe(channel: string): Rx.Observable<any> {
  //     this.observables = this.observables.filter((x: ChannelObservable) => {
  //         return x.channel === channel;
  //     });
  // }

  /** publish provides a way for calls to emit events on any channel. In a
   * production app the server would ensure that only authorized clients can
   * actually emit the message, but here we're not concerned about that.
   */
  private publish(ev: ChannelEvent): void {
    this.hubConnection?.invoke('Publish', ev);
  }
}
