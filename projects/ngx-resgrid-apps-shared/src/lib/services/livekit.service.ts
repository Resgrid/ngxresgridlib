import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import {
  ConnectionQuality,
  ConnectionState,
  DataPacket_Kind,
  DisconnectReason,
  ExternalE2EEKeyProvider,
  LocalAudioTrack,
  LocalParticipant,
  LogLevel,
  MediaDeviceFailure,
  Participant,
  ParticipantEvent,
  RemoteParticipant,
  RemoteTrackPublication,
  RemoteVideoTrack,
  Room,
  RoomConnectOptions,
  RoomEvent,
  RoomOptions,
  SimulationScenario,
  Track,
  TrackPublication,
  VideoCaptureOptions,
  VideoCodec,
  VideoPresets,
  VideoQuality,
  createAudioAnalyser,
  setLogLevel,
  supportsAV1,
  supportsVP9,
} from 'livekit-client';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { VoiceService } from './v4/voice.service';
import {
  IRGPluginOptionRoom,
  IRGPluginOptions,
} from '../models/plugin/rgPluginOptions';
import { ResgridConfig } from '../resgrid-config';
import { CanConnectToVoiceSessionResult } from '../models/v4/voice/canConnectToVoiceSessionResult';

@Injectable({
  providedIn: 'root',
})
export class LiveKitService {
  private departmentVoiceOptions: IRGPluginOptions = {
    token: '',
    url: '',
    type: 0,
    defaultMic: '',
    defaultSpeaker: '',
    apiUrl: '/',
    canConnectToVoiceApiToken: '',
    rooms: [],
  };
  private canConnect: CanConnectToVoiceSessionResult | null = null;
  private state = {
    isFrontFacing: false,
    encoder: new TextEncoder(),
    decoder: new TextDecoder(),
    defaultDevices: new Map<MediaDeviceKind, string>(),
    bitrateInterval: undefined as any,
  };

  public room: Room | null = null;
  public devices: MediaDeviceInfo[] = [];

  public callConnected: boolean = false;
  public startTime: number | null = null;

  public participants: Participant[] = [];
  elementMapping: { [k: string]: MediaDeviceKind } = {
    //'video-input': 'videoinput',
    //'audio-input': 'audioinput',
    //'audio-output': 'audiooutput',
  };

  constructor(
    private http: HttpClient,
    private voiceService: VoiceService,
    private config: ResgridConfig
  ) {}

  init(): Observable<IRGPluginOptions> {
    return this.voiceService.getDepartmentVoiceSettings().pipe(
      take(1),
      map((data) => {
        if (data && data.Data && data.Data.VoiceEnabled) {
          let options: IRGPluginOptions = {
            token: '',
            url: data.Data.VoipServerWebsocketSslAddress,
            type: 0,
            defaultMic: '',
            defaultSpeaker: '',
            apiUrl: this.config.apiUrl + '/',
            canConnectToVoiceApiToken: data.Data.CanConnectApiToken,
            rooms: [],
          };

          if (data.Data.Channels && data.Data.Channels.length > 0) {
            data.Data.Channels.forEach((channel) => {
              options.rooms.push({
                name: channel.Name,
                id: channel.Id,
                token: channel.Token,
              });
            });
          }

          this.departmentVoiceOptions = options;
        }

        return this.departmentVoiceOptions;
      })
    );
  }

  canConnectToVoice() {
    return this.voiceService
      .getCanConnectToVoiceSession(
        this.departmentVoiceOptions!.canConnectToVoiceApiToken
      )
      .pipe(
        map((res: CanConnectToVoiceSessionResult) => {
          this.canConnect = res;
          return res;
        })
      );
  }

  public async connect(room: IRGPluginOptionRoom) {
    const simulcast = false;
    const dynacast = true;  // optimize publishing bandwidth and CPU for published tracks
    const forceTURN = false;
    const adaptiveStream = true; // automatically manage subscribed video quality
    const shouldPublish = true;
    const autoSubscribe = true;

    setLogLevel(LogLevel.debug);

    const roomOpts: RoomOptions = {
      adaptiveStream,
      dynacast,
      publishDefaults: {
        simulcast,
        videoSimulcastLayers: [VideoPresets.h90, VideoPresets.h216],
        videoCodec: 'vp8',
        dtx: true,
        red: true,
        forceStereo: false,
      },
      videoCaptureDefaults: {
        resolution: VideoPresets.h720.resolution,
      },
      e2ee: undefined,
    };

    const connectOpts: RoomConnectOptions = {
      autoSubscribe: autoSubscribe,
    };
    if (forceTURN) {
      connectOpts.rtcConfig = {
        iceTransportPolicy: 'relay',
      };
    }
    await this.connectToRoom(
      this.departmentVoiceOptions.url,
      room.token,
      roomOpts,
      connectOpts,
      shouldPublish
    );
  }

  private async connectToRoom(
    url: string,
    token: string,
    roomOptions?: RoomOptions,
    connectOptions?: RoomConnectOptions,
    shouldPublish?: boolean
  ): Promise<Room | undefined> {
    this.room = new Room(roomOptions);

    const startTime = Date.now();
    await this.room.prepareConnection(url, token);
    const prewarmTime = Date.now() - startTime;
    const that = this;
    this.room
      .on(RoomEvent.ParticipantConnected, (participant: RemoteParticipant) => { that.participantConnected(that, participant);})
      .on(RoomEvent.Disconnected, that.handleRoomDisconnect)
      .on(RoomEvent.DataReceived, that.handleData)
      .on(RoomEvent.ParticipantDisconnected, (participant: RemoteParticipant) => { that.renderParticipant(participant, true);})
      .on(RoomEvent.Reconnected, async () => {})
      .on(RoomEvent.LocalTrackPublished, (pub) => {
        const track = pub.track as LocalAudioTrack;

        if (track instanceof LocalAudioTrack) {
          const { calculateVolume } = createAudioAnalyser(track);

          setInterval(() => {
            const codecElm = <HTMLElement>(
              document.getElementById('local-volume')
            );
            codecElm.setAttribute('value', calculateVolume().toFixed(4));
          }, 200);
        }
        // When the track is a LocalVideoTrack the below errors out on the participant.getTrack call
        this.renderParticipant(this.room!.localParticipant);
        this.updateButtonsForPublishState();
        //this.renderScreenShare(this.room);
      })
      .on(RoomEvent.LocalTrackUnpublished, () => {
        this.renderParticipant(this.room!.localParticipant);
        this.updateButtonsForPublishState();
        //this.renderScreenShare(this.room);
      })
      .on(RoomEvent.RoomMetadataChanged, (metadata) => {})
      .on(RoomEvent.MediaDevicesChanged, this.handleDevicesChanged)
      .on(RoomEvent.AudioPlaybackStatusChanged, () => {
        if (this.room!.canPlaybackAudio) {
          //const element = <HTMLButtonElement>(
          //  document.getElementById('start-audio-button')
          //);
          //element.setAttribute('disabled', 'true');
        } else {
          //const element = <HTMLButtonElement>(
          //  document.getElementById('start-audio-button')
          //);
          //element.setAttribute('disabled', 'true');
        }
      })
      .on(RoomEvent.MediaDevicesError, (e: Error) => {
        const failure = MediaDeviceFailure.getFailure(e);
      })
      .on(
        RoomEvent.ConnectionQualityChanged,
        (quality: ConnectionQuality, participant?: Participant) => {}
      )
      .on(RoomEvent.TrackSubscribed, (track, pub, participant) => {
        this.renderParticipant(participant);
        //this.renderScreenShare(this.room);
      })
      .on(RoomEvent.TrackUnsubscribed, (_, pub, participant) => {
        this.renderParticipant(participant);
        //this.renderScreenShare(this.room);
      })
      .on(RoomEvent.SignalConnected, async () => {
        const signalConnectionTime = Date.now() - startTime;
        // speed up publishing by starting to publish before it's fully connected
        // publishing is accepted as soon as signal connection has established
        if (shouldPublish) {
          //await this.room!.localParticipant.enableCameraAndMicrophone();
          //await this.room!.localParticipant.setMicrophoneEnabled(true);
          //this.updateButtonsForPublishState();
        }
      })
      .on(RoomEvent.ParticipantEncryptionStatusChanged, () => {
        this.updateButtonsForPublishState();
      })
      .on(
        RoomEvent.TrackStreamStateChanged,
        (pub, streamState, participant) => {}
      );

    try {
      // read and set current key from input
      //const cryptoKey = this.e2EEKey;
      //this.state.e2eeKeyProvider.setKey(cryptoKey);
      //if (this.e2ee) {
      // await this.room.setE2EEEnabled(true);
      //}

      await this.room.connect(url, token, connectOptions);
      const elapsed = Date.now() - startTime;
    } catch (error: any) {
      let message: any = error;
      if (error.message) {
        message = error.message;
      }
      return;
    }
    let currentRoom = this.room;
    this.setButtonsForState(true);

    if (this.room && this.room.remoteParticipants) {
      this.room.remoteParticipants.forEach((participant) => {
        this.participantConnected(this, participant);
      });
    }
    this.participantConnected(this, this.room.localParticipant);

    //await this.room.localParticipant.setMicrophoneEnabled(false);
    await this.room.localParticipant.setCameraEnabled(false);

    return this.room;
  }

  renderParticipant(participant: Participant, remove: boolean = false) {
    const container = <HTMLElement>document.getElementById('participants-area');
    if (!container) return;
    const { identity } = participant;
    let div = <HTMLElement>document.getElementById('participant-' + identity);
    if (!div && !remove) {
      div = document.createElement('div');
      div.id = `participant-${identity}`;
      div.className = 'participant';
      div.innerHTML = `
      <video id="video-${identity}"></video>
      <audio id="audio-${identity}"></audio>
      <div class="info-bar">
        <div id="name-${identity}" class="name">
        </div>
        <div style="text-align: center;">
          <span id="codec-${identity}" class="codec">
          </span>
          <span id="size-${identity}" class="size">
          </span>
          <span id="bitrate-${identity}" class="bitrate">
          </span>
        </div>
        <div class="right">
          <span id="signal-${identity}"></span>
          <span id="mic-${identity}" class="mic-on"></span>
          <span id="e2ee-${identity}" class="e2ee-on"></span>
        </div>
      </div>
      ${
        participant instanceof RemoteParticipant
          ? `<div class="volume-control">
        <input id="volume-${identity}" type="range" min="0" max="1" step="0.1" value="1" orient="vertical" />
      </div>`
          : `<progress id="local-volume" max="1" value="0"></progress>`
      }`;
      //<video class="video-elm" id="video-${identity}"></video>

      container.appendChild(div);
      let sizeElm = <HTMLSpanElement>(
        document.getElementById('size-' + identity)
      );
      //let videoElm = <HTMLVideoElement>(
      //  document.getElementById('video-' + identity)
      //);

      //videoElm.onresize = () => {
      //  this.updateVideoSize(videoElm!, sizeElm!);
      //};
    }
    let videoElm = <HTMLVideoElement>(
      document.getElementById('video-' + identity)
    );

    let audioELm = <HTMLAudioElement>(
      document.getElementById('audio-' + identity)
    );

    if (remove) {
      div.remove();
      container.style.display = 'none';
      if (videoElm) {
        videoElm.srcObject = null;
        videoElm.src = '';
      }
      if (audioELm) {
        audioELm.srcObject = null;
        audioELm.src = '';
      }
      return;
    }

    // update properties
    const element = <HTMLElement>document.getElementById('name-' + identity);
    element.innerHTML = participant.identity;

    if (participant instanceof LocalParticipant) {
      element.innerHTML += ' (you)';
    }
    const micElm = <HTMLElement>document.getElementById('mic-' + identity);
    const signalElm = <HTMLElement>(
      document.getElementById('signal-' + identity)
    );

    //try {
      const cameraPub = undefined;//participant.getTrackPublication(Track.Source.Camera);
      const micPub = participant.getTrackPublication(Track.Source.Microphone);

      if (participant.isSpeaking) {
        div!.classList.add('speaking');
      } else {
        div!.classList.remove('speaking');
      }

      if (participant instanceof RemoteParticipant) {
        //const volumeSlider = <HTMLInputElement>(
        //  document.getElementById('volume-' + identity)
        //);
        //volumeSlider.addEventListener('input', (ev) => {
        //  participant.setVolume(
        //    Number.parseFloat((ev.target as HTMLInputElement).value)
        //  );
        //});

        participant.setVolume(1);
      }

      /*
    const cameraEnabled = false;//cameraPub && cameraPub.isSubscribed && !cameraPub.isMuted;
    if (cameraEnabled) {
      if (participant instanceof LocalParticipant) {
        // flip
        videoElm.style.transform = 'scale(-1, 1)';
      } else if (!cameraPub?.videoTrack?.attachedElements.includes(videoElm)) {
        const renderStartTime = Date.now();
        // measure time to render
        videoElm.onloadeddata = () => {
          const elapsed = Date.now() - renderStartTime;
          let fromJoin = 0;
          if (
            participant.joinedAt &&
            participant.joinedAt.getTime() < this.startTime!
          ) {
            fromJoin = Date.now() - this.startTime!;
          }
        };
      }
      cameraPub?.videoTrack?.attach(videoElm);
    } else {
      // clear information display
      let element = <HTMLElement>document.getElementById('size-' + identity);
      element.innerHTML = '';
      if (cameraPub?.videoTrack) {
        // detach manually whenever possible
        cameraPub.videoTrack?.detach(videoElm);
      } else {
        videoElm.src = '';
        videoElm.srcObject = null;
      }
    }
    */

      const micEnabled = micPub && micPub.isSubscribed && !micPub.isMuted;
      if (micEnabled) {
        if (!(participant instanceof LocalParticipant)) {
          // don't attach local audio
          audioELm.onloadeddata = () => {
            if (
              participant.joinedAt &&
              participant.joinedAt.getTime() < this.startTime!
            ) {
              const fromJoin = Date.now() - this.startTime!;
            }
          };
          micPub?.audioTrack?.attach(audioELm);
        }
        //micElm.className = 'mic-on';
        //micElm.innerHTML = '<i class="fas fa-microphone"></i>';
      } else {
        //micElm.className = 'mic-off';
        //micElm.innerHTML = '<i class="fas fa-microphone-slash"></i>';
      }
    //} catch (error) {}

    //let e2eeElm = <HTMLElement>document.getElementById('e2ee-' + identity);

    //if (participant.isEncrypted) {
    //  e2eeElm.className = 'e2ee-on';
    //  e2eeElm.innerHTML = '<i class="fas fa-lock"></i>';
    //} else {
    //  e2eeElm.className = 'e2ee-off';
    //  e2eeElm.innerHTML = '<i class="fas fa-unlock"></i>';
    //}

    //switch (participant.connectionQuality) {
    //  case ConnectionQuality.Excellent:
    //  case ConnectionQuality.Good:
    //  case ConnectionQuality.Poor:
    //    signalElm.className = `connection-${participant.connectionQuality}`;
    //    signalElm.innerHTML = '<i class="fas fa-circle"></i>';
    //    break;
    //  default:
    //    signalElm.innerHTML = '';
    //  // do nothing
    //}
  }

  participantConnected(that: any, participant: Participant) {
    console.log('tracks', participant.trackPublications);

    participant
      .on(ParticipantEvent.TrackMuted, (pub: TrackPublication) => {
        that.renderParticipant(participant);
      })
      .on(ParticipantEvent.TrackUnmuted, (pub: TrackPublication) => {
        that.renderParticipant(participant);
      })
      .on(ParticipantEvent.IsSpeakingChanged, () => {
        that.renderParticipant(participant);
      })
      .on(ParticipantEvent.ConnectionQualityChanged, () => {
        that.renderParticipant(participant);
      });
  }

  handleRoomDisconnect(reason?: DisconnectReason) {
    if (!this.room) return;
    this.setButtonsForState(false);
    this.renderParticipant(this.room.localParticipant, true);
    this.room.remoteParticipants.forEach((p) => {
      this.renderParticipant(p, true);
    });
    //this.renderScreenShare(this.room);
    const container = <HTMLElement>document.getElementById('participants-area');

    if (container) {
      container.remove();
    }

    // clear the chat area on disconnect
    const chat = <HTMLTextAreaElement>document.getElementById('chat');
    chat.value = '';
  }

  handleData(msg: Uint8Array, participant?: RemoteParticipant) {
    console.log('handleData', msg);
    const str = this.state.decoder.decode(msg);
    const chat = <HTMLTextAreaElement>document.getElementById('chat');
    let from = 'server';
    if (participant) {
      from = participant.identity;
    }
    chat.value += `${from}: ${str}\n`;
  }

  updateButtonsForPublishState() {
    if (!this.room) {
      return;
    }
    const lp = this.room.localParticipant;

    // video
    this.setButtonState(
      'toggle-video-button',
      `${lp.isCameraEnabled ? 'Disable' : 'Enable'} Video`,
      lp.isCameraEnabled
    );

    // audio
    this.setButtonState(
      'toggle-audio-button',
      `${lp.isMicrophoneEnabled ? 'Disable' : 'Enable'} Audio`,
      lp.isMicrophoneEnabled
    );

    // screen share
    this.setButtonState(
      'share-screen-button',
      lp.isScreenShareEnabled ? 'Stop Screen Share' : 'Share Screen',
      lp.isScreenShareEnabled
    );

    // e2ee
    this.setButtonState(
      'toggle-e2ee-button',
      `${this.room.isE2EEEnabled ? 'Disable' : 'Enable'} E2EE`,
      this.room.isE2EEEnabled
    );
  }

  setButtonsForState(connected: boolean) {
    const connectedSet = [
      'toggle-video-button',
      'toggle-audio-button',
      'share-screen-button',
      'disconnect-ws-button',
      'disconnect-room-button',
      'flip-video-button',
      'send-button',
    ];
    if (this.room && this.room.options.e2ee) {
      connectedSet.push('toggle-e2ee-button', 'e2ee-ratchet-button');
    }
    const disconnectedSet = ['connect-button'];

    const toRemove = connected ? connectedSet : disconnectedSet;
    const toAdd = connected ? disconnectedSet : connectedSet;
    toRemove.forEach((id) => {
      const element = <HTMLButtonElement>document.getElementById(id);
      if (element) {
        element.removeAttribute('disabled');
      }
    });
    toAdd.forEach((id) => {
      const element = <HTMLButtonElement>document.getElementById(id);
      if (element) {
        element.setAttribute('disabled', 'true');
      }
    });
  }

  public async toggleAudio(mute: boolean): Promise<boolean> {
    if (!this.room) return false;

    await this.room.localParticipant.setMicrophoneEnabled(!mute);
    return this.room.localParticipant.isMicrophoneEnabled;
  }

  public async toggleVideo(disableCamera: boolean): Promise<boolean> {
    if (!this.room) return false;

    await this.room.localParticipant.setCameraEnabled(!disableCamera);

    // Donno why, leaving here for now
    //this.renderParticipant(this.room.localParticipant);

    return this.room.localParticipant.isCameraEnabled;
  }

  public async disconnect() {
    if (this.room) {
      await this.room.disconnect();
    }
    if (this.state.bitrateInterval) {
      clearInterval(this.state.bitrateInterval);
    }
  }

  setButtonState(
    buttonId: string,
    buttonText: string,
    isActive: boolean,
    isDisabled: boolean | undefined = undefined
  ) {
    const el = <HTMLButtonElement>document.getElementById(buttonId);
    if (!el) return;
    if (isDisabled !== undefined) {
      el.disabled = isDisabled;
    }
    el.innerHTML = buttonText;
    if (isActive) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  }

  async handleDevicesChanged() {
    Promise.all(
      Object.keys(this.elementMapping).map(async (id) => {
        const kind = this.elementMapping[id];
        if (!kind) {
          return;
        }
        this.devices = await Room.getLocalDevices(kind);
        const element = <HTMLSelectElement>document.getElementById(id);
        this.populateSelect(
          element,
          this.devices,
          this.state.defaultDevices.get(kind)
        );
      })
    );
  }

  private updateVideoSize(element: HTMLVideoElement, target: HTMLElement) {
    target.innerHTML = `(${element.videoWidth}x${element.videoHeight})`;
  }

  private participantDisconnected(participant: RemoteParticipant) {
    this.renderParticipant(participant, true);
  }

  private populateSelect(
    element: HTMLSelectElement,
    devices: MediaDeviceInfo[],
    selectedDeviceId?: string
  ) {
    // clear all elements
    element.innerHTML = '';

    for (const device of devices) {
      const option = document.createElement('option');
      option.text = device.label;
      option.value = device.deviceId;
      if (device.deviceId === selectedDeviceId) {
        option.selected = true;
      }
      element.appendChild(option);
    }
  }
}
