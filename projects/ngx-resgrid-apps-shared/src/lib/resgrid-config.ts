export interface ResgridASConfiguration {
  baseApiUrl: () => string;
  apiVersion: string;
  clientId: string;
  googleApiKey: string;
  channelUrl: string;
  channelHubName: string;
  logLevel: number;
  isMobileApp: boolean;
  cacheProvider: any;
}

export class ResgridConfig implements ResgridASConfiguration {
  public baseApiUrl = (): string => {return 'http://localhost:8080/api/'};
  public apiVersion: string = 'v4';
  public channelUrl: string = '';
  public channelHubName: string = '';
  public clientId: string = '';
  public googleApiKey: string = '';
  public logLevel: number = 0;
  public isMobileApp: boolean = false;
  public cacheProvider: any = null;

  get apiUrl(): string {
    return `${this.baseApiUrl()}/api/${this.apiVersion}`;
  }
}
