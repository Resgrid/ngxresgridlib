import { Injectable, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Consts } from '../consts';
import { PubSubService } from './pubsub.service';

@Injectable({
  providedIn: 'root',
})
export class EventsService {
  constructor(
    private pubsubSvc: PubSubService,
    private consts: Consts,
  ) {
    this.pubsubSvc.registerEventWithLast(
      this.consts.EVENTS.LOGGED_IN,
      undefined,
    );
    this.pubsubSvc.registerEventWithLast(
      this.consts.EVENTS.SYSTEM_READY,
      undefined,
    );
    this.pubsubSvc.registerEventWithLast(
      this.consts.EVENTS.COREDATASYNCED,
      undefined,
    );
    this.pubsubSvc.registerEventWithLast(
      this.consts.EVENTS.LOCAL_DATA_SET,
      undefined,
    );
    this.pubsubSvc.registerEventWithLast(
      this.consts.EVENTS.SETTINGS_SAVED,
      undefined,
    );
    this.pubsubSvc.registerEventWithLast(
      this.consts.EVENTS.STATUS_UPDATED,
      undefined,
    );
    this.pubsubSvc.registerEventWithLast(
      this.consts.EVENTS.STAFFING_UPDATED,
      undefined,
    );
    this.pubsubSvc.registerEventWithLast(
      this.consts.EVENTS.SECURITY_SET,
      undefined,
    );
  }

  public publishEvent(eventName: string, data?: any): void {
    this.pubsubSvc.publishEvent(eventName, data);
  }

  public subscribe(
    eventName: string,
    next?: (value: any) => void,
    error?: (error: any) => any,
    complete?: () => void,
  ): Subscription {
    return this.pubsubSvc.subscribe(eventName, next, error, complete);
  }
}
