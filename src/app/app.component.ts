import { Component } from '@angular/core';
import { CallPrioritiesService, CallsService, RealtimeGeolocationService, SignalRService } from 'ngx-resgridlib';
import { AuthService } from 'ngx-resgridlib';

@Component({
  selector: 'resgrid-apps-shared-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ResgridAppShared';

  constructor(private authService: AuthService, private callsService: CallsService, 
    private callPrioritiesService: CallPrioritiesService, private realtimeGeolocationService: RealtimeGeolocationService,
    private signalRService: SignalRService) {
    
  }

  public tryLogin() {
    this.authService.login({username: '', password: '', refresh_token: ''}).subscribe( (data) => { });
  }

  public getActiveCalls() {
    this.callsService.getActiveCalls().subscribe( (data) => { });
  }

  public tryTokenRefresh() {
    this.authService.refreshTokens().subscribe( (data) => { });
  }

  public getCallPriorities() {
    this.callPrioritiesService.getAllCallPriorites().subscribe( (data) => { });
  }

  public connectToGeolocationHub() {
    this.realtimeGeolocationService.start();
  }
}
