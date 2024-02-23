import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import {HttpClientModule} from '@angular/common/http';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { NgxResgridLibModule } from 'projects/ngx-resgrid-apps-shared/src/public-api';
import { ResgridConfig } from 'ngx-resgridlib';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserTestingModule } from '@angular/platform-browser/testing';

let getBaseUrl = (): string => {
  return 'https://api.resgrid.com';
}

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, NgxResgridLibModule.forRoot({
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
      BrowserTestingModule],
      declarations: [
        AppComponent,
      ],
    }).compileComponents();
  });

  //it('should create the app', () => {
  //  const fixture = TestBed.createComponent(AppComponent);
  //  const app = fixture.componentInstance;
  //  expect(app).toBeTruthy();
  //});

  //it(`should have as title 'ResgridAppShared'`, () => {
  //  const fixture = TestBed.createComponent(AppComponent);
  //  const app = fixture.componentInstance;
  //  expect(app.title).toEqual('ResgridAppShared');
  //});

  //it('should render title', () => {
  //  const fixture = TestBed.createComponent(AppComponent);
  //  fixture.detectChanges();
  //  const compiled = fixture.nativeElement;
  //  expect(compiled.querySelector('.content span').textContent).toContain('ResgridAppShared app is running!');
  //});
});
