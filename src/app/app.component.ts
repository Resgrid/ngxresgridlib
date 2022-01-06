import { Component } from '@angular/core';
import { CallsService } from 'projects/ngx-resgrid-apps-shared/src/lib/services/v4/calls.service';
import { AuthService } from 'projects/ngx-resgrid-apps-shared/src/lib/services/v4/auth.service';

@Component({
  selector: 'resgrid-apps-shared-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'ResgridAppShared';

  constructor(private authService: AuthService, private callsService: CallsService) {
    
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
}
