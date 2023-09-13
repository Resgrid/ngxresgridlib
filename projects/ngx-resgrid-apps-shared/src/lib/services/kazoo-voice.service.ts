import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { WindowRef } from './window.service';
import { concatMap, delay } from 'rxjs/operators';
import { ResgridConfig } from '../resgrid-config';
import { DepartmentVoiceResultData } from '../models/v4/voice/departmentVoiceResultData';

@Injectable({
  providedIn: 'root',
})
export class KazooVoiceService {
  private _userAgent: any;
  private _pin: string = '';

  constructor(
    private winRef: WindowRef,
    private config: ResgridConfig,
  ) {}

  public startVoipServices(voice: DepartmentVoiceResultData) {
    if (voice && voice.UserInfo) {
      var config = {
        dialpad: {
          //renderTargets: ['dialpad'],
        },
        callList: {
          //renderTargets: ['call_list'],
        },
        callControl: {
          //renderTargets: ['call_control'],
        },
        mediaDevices: {
          //renderTargets: ['media_devices'],
          videoinput: {
            enabled: false,
          },
        },
        audioContext: {
          //renderTargets: ['audio_context'],
        },
        userAgent: {
          renderTargets: [],
          transport: {
            sockets: ['wss://' + voice.VoipServerWebsocketSslAddress],
            recovery_max_interval: 30,
            recovery_min_interval: 2,
          },
          authentication: {
            username: voice.UserInfo.Username,
            password: voice.UserInfo.Password,
            realm: voice.Realm,
          },
          user_agent: {
            //contact_uri: '',
            display_name: voice.CallerIdName + '(Dispatch)',
            //instance_id: '8f1fa16a-1165-4a96-8341-785b1ef24f12',
            // no_answer_timeout: 60,
            register: true,
            register_expires: 300,
            user_agent: 'libwebphone - dispatch app',
          },
        },
      }; //End ofConfig

      this._userAgent = new this.winRef.nativeWindow.libwebphone(config);
      this._userAgent.on('connected', (callback: any) => {});
      this._userAgent.on('disconnected', (callback: any) => {});
      this._userAgent.on('registered', (callback: any) => {});
      this._userAgent.on('unregistered', (callback: any) => {});
      this._userAgent.on('registrationFailed', (callback: any) => {});
      this._userAgent.on('registrationExpiring', (callback: any) => {});
      this._userAgent.on('newRTCSession', (callback: any) => {});
      this._userAgent.on('newMessage', (callback: any) => {});
      this._userAgent.on('sipEvent', (callback: any) => {});

      this._userAgent.on('call.primary.established', (callback: any) => {
        this.mute();
        this.processPin();
      });

      this._userAgent.on('userAgent.call.failed', (callback: any) => {});

      this._userAgent.getUserAgent().start();
      this._pin = voice.UserInfo.Pin;
    }
  }

  public joinChannel(channel: string) {
    if (this._userAgent) {
      this._userAgent.getUserAgent().call(channel);
    }
  }

  public disconnect() {
    if (this._userAgent) {
      this._userAgent.getUserAgent().hangupAll();
    }
  }

  public mute() {
    if (this._userAgent) {
      this._userAgent.getCallControl().mute();
    }
  }

  public unmute() {
    if (this._userAgent) {
      this._userAgent.getCallControl().unmute();
    }
  }

  private processPin() {
    if (this._userAgent) {
      const ac = this._userAgent.getAudioContext();
      var orgVolume = ac.getVolume('tones');
      ac.changeVolume('tones', 0);
      //ac.togglePreviewTone();

      var numbers = this._pin.split('');
      from(numbers)
        .pipe(concatMap((item) => of(item).pipe(delay(500))))
        .subscribe((number) => {
          this._userAgent.getDialpad().dial(number);
        });

      ac.changeVolume('tones', orgVolume);
    }
  }
}
