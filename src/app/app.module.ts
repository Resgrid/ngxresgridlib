import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { NgxResgridLibModule } from 'projects/ngx-resgrid-apps-shared/src/public-api';
import { AppComponent } from './app.component';

let getBaseUrl = (): string => {
  return 'http://localhost:8081';
};

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    NgxResgridLibModule.forRoot({
      baseApiUrl: getBaseUrl,
      apiVersion: 'v4',
      clientId: 'test',
      googleApiKey: '',
      channelUrl: '',
      channelHubName: '',
      logLevel: 0,
      isMobileApp: false,
    }),
  ],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
