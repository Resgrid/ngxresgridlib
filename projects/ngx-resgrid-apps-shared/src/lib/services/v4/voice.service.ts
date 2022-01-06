import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { DepartmentVoiceResult } from '../../models/v4/voice/departmentVoiceResult';
import { VoiceSessionConnectionResult } from '../../models/v4/voice/voiceSessionConnectionResult';


@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getDepartmentVoiceSettings(): Observable<DepartmentVoiceResult> {
    const url = this.config.apiUrl + '/Voice/GetDepartmentVoiceSettings';
    return this.http.get<DepartmentVoiceResult>(url);
  }

  public connectToSession(sessionId: string): Observable<VoiceSessionConnectionResult> {
    const url = this.config.apiUrl + '/Voice/ConnectToSession?sessionId=' + sessionId;
    return this.http.get<VoiceSessionConnectionResult>(url);
  }
}
