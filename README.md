# `Ngx-ResgridLib` - Angular Library for the Resgrid API

Ngx-ResgridLib is an Angular library used by Resgrid in all of our mobile applications and web applications to interact with the Resgrid API. This library is a **foundational element** to all of our applications and contains a large cross-section of code used in building our mobile applications which are written in [Ionic Framework](https://ionicframework.com/) and [Capacitor](https://capacitorjs.com/).

## About Resgrid

Resgrid is an open-source Computer Aided Dispatch (CAD) solution for first responders, businesses and industrial environments.

[Sign up for your free Resgrid Account Today!](https://resgrid.com)

# Features

- **V4 API** compatible with the v4 version of the [Resgrid API](https://api.resgrid.com/index.html?urls.primaryName=Resgrid%20API%20V4)
- **RxJS** Services for each API utilizing RxJS
- **Authentication** Library handles the auth flow and storing of the refresh token

# Installation

```bash
# Install the library
npm install @resgrid/ngx-resgridlib --save

```

# Getting Started

```ts
  import { NgxResgridLibModule } from '@resgrid/ngx-resgridlib';

  let getBaseUrl = (): string => {
    return 'http://localhost:8081';
  }

  @NgModule({
    declarations: [
      AppComponent
    ],
    imports: [
      ... ,

      NgxResgridLibModule.forRoot({
          baseApiUrl: getBaseUrl,
          apiVersion: 'v4',
          clientId: 'test',
          googleApiKey: '',
          channelUrl: '',
          channelHubName: '',
          logLevel: 0
          }),
    ],
    providers: [],
    bootstrap: [ AppComponent ]
  })

  export class AppModule { }
```

### NgxResgridLibModule Options

<table>
  <tr>
    <th>Setting</th>
    <th>Description</th>
  </tr>
  <tr>
    <td>baseApiUrl</td>
    <td>
      The base URL to talk to the Resgrid API (Services) for our hosted production system this is "https://api.resgrid.com". This is a function that should return the string url to the api without nothing past the hostname and/or port.
    </td>
  </tr>
  <tr>
    <td>apiVersion</td>
    <td>
      Version of the API to call, currently only `v4` is supported
    </td>
  </tr>
  <tr>
    <td>clientId</td>
    <td>
      Just a name to give to your application using this library
    </td>
  </tr>
   <td>googleApiKey</td>
    <td>
      Your Google Map account API key
    </td>
  </tr>
  <tr>
    <td>channelUrl</td>
    <td>
      The URL to connect to the SignalR hub for our hosted production system this is "https://api.resgrid.com/signalr"
    </td>
  </tr>
  <tr>
    <td>channelHubName</td>
    <td>
      The SignalR hub name to connect to receive events for
    </td>
  </tr>
  <tr>
    <td>logLevel</td>
    <td>
      Log level for the library 0 = Debug and above, 1 = Warn and above, 2 = Error only, -1 = Off
    </td>
  </tr>
</table>

## License

[Apache 2.0](https://www.apache.org/licenses/LICENSE-2.0)
