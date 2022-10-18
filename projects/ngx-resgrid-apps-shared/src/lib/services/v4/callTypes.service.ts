import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ResgridConfig } from '../../resgrid-config';
import { CallTypesResult } from '../../models/v4/callTypes/callTypesResult';
import { CacheService } from '../cache.service';
import { LoggerService } from '../logger.service';


@Injectable({
  providedIn: 'root',
})
export class CallTypesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
    private cacheService: CacheService, 
    private loggerService: LoggerService
  ) {}

  public getAllCallTypes(): Observable<CallTypesResult> {
    const url = this.config.apiUrl + '/CallTypes/GetAllCallTypes';
    const temp = new CallTypesResult();

    return from(this.cacheService.getHttpResponse(temp.cacheKey)).pipe(
      switchMap((cachedResponse) => {
        if (cachedResponse) {
          this.loggerService.logDebug(`Returning a cached response: ${temp.cacheKey} data: ${JSON.stringify(cachedResponse)}`);
          return of(cachedResponse.body);
        } else {
          return this.http.get<CallTypesResult>(url, {
            context:  this.cacheService.setCacheInfoHttpContext(temp),
          });
        }
      }),
      catchError((val) => {
        return this.http.get<CallTypesResult>(url, {
          context:  this.cacheService.setCacheInfoHttpContext(temp),
        });
      })
    );
  }
}
