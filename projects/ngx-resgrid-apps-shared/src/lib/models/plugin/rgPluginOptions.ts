export interface IRGPluginOptions {
  token: string;
  url: string;
  type: number;
  defaultMic: string;
  defaultSpeaker: string;
  apiUrl: string;
  canConnectToVoiceApiToken: string;
  rooms: IRGPluginOptionRoom[];
}

export interface IRGPluginOptionRoom {
  name: string;
  id: string;
  token: string;
}
