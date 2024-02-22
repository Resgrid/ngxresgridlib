import { HttpClient } from '@angular/common/http';
import { ElementRef, Injectable } from '@angular/core';
import {
  LocalParticipant,
  LocalTrackPublication,
  Participant,
  RemoteParticipant,
  RemoteTrack,
  RemoteTrackPublication,
  Room,
  RoomConnectOptions,
  RoomEvent,
  Track,
  VideoPresets,
  setLogLevel,
} from 'livekit-client';
import { DepartmentVoiceResult, VoiceService } from 'ngx-resgridlib/public-api';
import { catchError, map, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LiveKitService {
  private departmentVoiceOptions: any;

  public room: any | null = null;
  public url: string = ''; //= environment.webrtcSdkServerUrl;
  public token: any | null = null;
  public appToken: any | null = null;
  public remoteUser: any | null = null;
  public callConnected: boolean = false;
  private localElement: ElementRef | string | any;
  private remoteElement: ElementRef | string | any;
  noop: any;

  constructor(private http: HttpClient, private voiceService: VoiceService) {}

  init(baseUrl: string) {
    this.voiceService
      .getDepartmentVoiceSettings()
      .pipe(take(1))
      .subscribe((data) => {
        if (data && data.Data && data.Data.VoiceEnabled) {
          let options = {
            token: '',
            url: data.Data.VoipServerWebsocketSslAddress,
            type: 0,
            defaultMic: '',
            defaultSpeaker: '',
            apiUrl: baseUrl + '/',
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
          };

          this.departmentVoiceOptions = options;
        }
      });
  }

  getToken(name: string, roomId: string, nurseName: string) {
    return this.http
      .get(
        `${environment.webrtcTokenServerUrl}api/getToken?name=${name}&roomId=${roomId}&nurseName=${nurseName}`
      )
      .pipe(
        map((res: any) => {
          this.token = res?.token;
          this.appToken = res?.appToken;
          return res;
        })
      );
  }

  async createRoomAndConnectCall({
    handleTrackSubscribed = this.handleTrackSubscribed.bind(this),
    handleTrackUnsubscribed = this.handleTrackUnsubscribed,
    handleActiveSpeakerChange = this.handleActiveSpeakerChange,
    handleDisconnect = this.noop,
    handleConnect = this.noop,
    handleLocalTrackUnpublished = this.handleLocalTrackUnpublished,
    handleLocalTrackPublished = this.attachLocalVideo.bind(this),
    autoEnableCameraOnConnect = true,
    localElement = 'local-video' /** It can be ElementRef or unique id in string for the local video container element */,
    remoteElement = 'remote-video' /** It can be ElementRef or unique id in string for the remote video container element */,
    handleTrackMuted = this.noop,
    handleTrackUnmuted = this.noop,
    handleParticipantDisconnected = this.noop,
    handleParticipantConnect = this.noop,
  }) {
    if (!this.token) {
      throw new Error('Token not found!');
      return;
    }

    this.localElement = localElement;
    this.remoteElement = remoteElement;
    this.clearAudioVideo();

    this.room = new Room({
      adaptiveStream: true /* automatically manage subscribed video quality */,
      dynacast:
        true /* optimize publishing bandwidth and CPU for published tracks */,
      videoCaptureDefaults: {
        resolution: VideoPresets.h90.resolution,
      },
      audioCaptureDefaults: {
        echoCancellation: true,
        autoGainControl: true,
        noiseSuppression: true,
      },
    });

    this.room
      .on(RoomEvent.TrackSubscribed, handleTrackSubscribed)
      .on(RoomEvent.TrackUnsubscribed, handleTrackUnsubscribed)
      .on(RoomEvent.ActiveSpeakersChanged, handleActiveSpeakerChange)
      .on(RoomEvent.Connected, handleConnect)
      .on(RoomEvent.Disconnected, handleDisconnect)
      .on(RoomEvent.LocalTrackUnpublished, handleLocalTrackUnpublished)
      .on(RoomEvent.LocalTrackPublished, handleLocalTrackPublished)
      .on(RoomEvent.ParticipantDisconnected, handleParticipantDisconnected)
      .on(RoomEvent.ParticipantConnected, handleParticipantConnect)
      .on(RoomEvent.TrackMuted, handleTrackMuted)
      .on(RoomEvent.TrackUnmuted, handleTrackUnmuted);

    console.clear();
    await this.room.connect(this.url, this.token);

    if (autoEnableCameraOnConnect) {
      await this.room.localParticipant.enableCameraAndMicrophone();
    }
  }

  clearAudioVideo() {
    try {
      this.localContainer.innerHTML = '';
      this.remoteContainer.innerHTML = '';
    } catch (error) {
      console.log('error: ', error);
    }
  }

  /**
   * Assign received streaming video to the passed local video container or id
   */
  attachLocalVideo() {
    const camTrack = this.room.localParticipant.getTrack(Track.Source.Camera);

    if (camTrack?.isSubscribed) {
      const videoElement = camTrack.videoTrack?.attach();
      const localContainer: any = this.localContainer;

      videoElement.style.height = '100%';
      localContainer.appendChild(videoElement);
    }
  }

  handleTrackSubscribed(
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ) {
    const element: any = track.attach();
    if (participant?.identity) {
      this.remoteUser = participant;
    }

    if (track.kind === Track.Kind.Audio) {
      this.remoteContainer.appendChild(element);
    } else if (track.kind === Track.Kind.Video) {
      element.style.height = '100%';
      this.remoteContainer.appendChild(element);
    }
  }

  handleTrackUnsubscribed(
    track: RemoteTrack,
    publication: RemoteTrackPublication,
    participant: RemoteParticipant
  ) {
    // remove tracks from all attached elements
    track?.detach();
  }

  handleLocalTrackUnpublished(
    track: LocalTrackPublication | any,
    participant: LocalParticipant
  ) {
    // when local tracks are ended, update UI to remove them from rendering
  }

  handleActiveSpeakerChange(speakers: Participant[]) {
    // show UI indicators when participant is speaking
  }

  /**
   * Method to toggle local video
   */
  public toggleVideo() {
    this.room.localParticipant.setCameraEnabled(
      !this.room.localParticipant.isCameraEnabled
    );
    return this.room.localParticipant.isCameraEnabled;
  }

  /**
   * Method to toggle local audio
   */
  public toggleAudio() {
    this.room.localParticipant.setMicrophoneEnabled(
      !this.room.localParticipant.isMicrophoneEnabled
    );
    return this.room.localParticipant.isMicrophoneEnabled;
  }

  handleDisconnect() {
    this.room.disconnect(true);
    this.localContainer.innerHTML = '';
    this.remoteContainer.innerHTML = '';
  }

  get remoteContainer() {
    return (
      this.remoteElement?.nativeElement ||
      document.getElementById(this.remoteElement)
    );
  }

  get localContainer() {
    return (
      this.localElement?.nativeElement ||
      document.getElementById(this.localElement)
    );
  }

  get currentRoom() {
    return this.room;
  }

  getRoomConnectionOpts(opts: any = {}): RoomConnectOptions {
    let connectOpts: RoomConnectOptions = {};

    connectOpts.rtcConfig = {
      iceTransportPolicy: 'relay',
      iceServers: [
        {
          username:
            'dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269',
          credential: 'tE2DajzSJwnsSbc123',
          urls: 'turn:global.turn.twilio.com:3478?transport=udp',
        },
        {
          username:
            'dc2d2894d5a9023620c467b0e71cfa6a35457e6679785ed6ae9856fe5bdfa269',
          credential: 'tE2DajzSJwnsSbc123',
          urls: 'turn:global.turn.twilio.com:3478?transport=tcp',
        },
        {
          urls: ['turn:demo.intelehealth.org:3478'],
          username: 'ihuser',
          credential: 'keepitsecrect',
        },
        {
          urls: ['turn:testing.intelehealth.org:3478'],
          username: 'ihuser',
          credential: 'keepitsecrect',
        },
        { urls: ['stun:stun.l.google.com:19302'] },
        { urls: ['stun:stun1.l.google.com:19302'] },
      ],
    };

    return { ...connectOpts, ...opts };
  }
}
