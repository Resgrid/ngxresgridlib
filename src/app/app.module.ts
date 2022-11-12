import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxResgridLibModule } from 'ngx-resgridlib';
import { AppComponent } from './app.component';

let getBaseUrl = (): string => {
  return 'https://api.resgrid.com';
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxResgridLibModule.forRoot({
      baseApiUrl: getBaseUrl, 
      apiVersion: 'v4', 
      clientId: 'test', 
      googleApiKey: '', 
      channelUrl: 'https://localhost:5003',
      channelHubName: '/eventingHub', 
      realtimeGeolocationHubName: '/geolocationHub',
      logLevel: 0, 
      isMobileApp: false,
      cacheProvider: null
    }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
