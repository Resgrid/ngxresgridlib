import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ResgridConfig } from '../../resgrid-config';
import { CallPrioritiesResult } from '../../models/v4/callPriorities/callPrioritiesResult';
import { CacheService } from '../cache.service';
import { LoggerService } from '../logger.service';
import { from, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class CallPrioritiesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
    private cacheService: CacheService, 
    private loggerService: LoggerService
  ) {}

  public getAllCallPriorites(): Observable<CallPrioritiesResult> {
    const url = this.config.apiUrl + '/CallPriorities/GetAllCallPriorites';
    const temp = new CallPrioritiesResult();

    return from(this.cacheService.getHttpResponse(temp.cacheKey)).pipe(
      switchMap((cachedResponse) => {
        if (cachedResponse) {
          this.loggerService.logDebug(`Returning a cached response: ${temp.cacheKey} data: ${JSON.stringify(cachedResponse)}`);
          return of(cachedResponse.body);
        } else {
          return this.http.get<CallPrioritiesResult>(url, {
            context:  this.cacheService.setCacheInfoHttpContext(temp),
          });
        }
      }),
      catchError((val) => {
        return this.http.get<CallPrioritiesResult>(url, {
          context:  this.cacheService.setCacheInfoHttpContext(temp),
        });
      })
    );
  }
}
