import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ResgridConfig } from '../../resgrid-config';
import { DepartmentVoiceResult } from '../../models/v4/voice/departmentVoiceResult';
import { VoiceSessionConnectionResult } from '../../models/v4/voice/voiceSessionConnectionResult';
import { CacheService } from '../cache.service';
import { LoggerService } from '../logger.service';
import { DepartmentAudioResult } from '../../models/v4/voice/departmentAudioResult';


@Injectable({
  providedIn: 'root',
})
export class VoiceService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
    private cacheService: CacheService, 
    private loggerService: LoggerService
  ) {}

  public getDepartmentVoiceSettings(): Observable<DepartmentVoiceResult> {
    const url = this.config.apiUrl + '/Voice/GetDepartmentVoiceSettings';
    const temp = new DepartmentVoiceResult();

    return from(this.cacheService.getHttpResponse(temp.cacheKey)).pipe(
      switchMap((cachedResponse) => {
        if (cachedResponse) {
          this.loggerService.logDebug(`Returning a cached response: ${temp.cacheKey} data: ${JSON.stringify(cachedResponse)}`);
          return of(cachedResponse.body);
        } else {
          return this.http.get<DepartmentVoiceResult>(url, {
            context:  this.cacheService.setCacheInfoHttpContext(temp),
          });
        }
      }),
      catchError((val) => {
        return this.http.get<DepartmentVoiceResult>(url, {
          context:  this.cacheService.setCacheInfoHttpContext(temp),
        });
      })
    );
  }

  public connectToSession(sessionId: string): Observable<VoiceSessionConnectionResult> {
    const url = this.config.apiUrl + '/Voice/ConnectToSession?sessionId=' + sessionId;
    return this.http.get<VoiceSessionConnectionResult>(url);
  }

  public getDepartmentAudioStreams(): Observable<DepartmentAudioResult> {
    const url = this.config.apiUrl + '/Voice/GetDepartmentAudioStreams';
    return this.http.get<DepartmentAudioResult>(url);
  }
}
