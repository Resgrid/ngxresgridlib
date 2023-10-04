import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ResgridConfig } from '../../resgrid-config';
import { GetConfigResult } from '../../models/v4/configs/getConfigResult';
import { CacheService } from '../cache.service';
import { LoggerService } from '../logger.service';


@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
    private cacheService: CacheService, 
    private loggerService: LoggerService
  ) {}

  public getConfig(key: string, bypassCache: boolean = false): Observable<GetConfigResult> {
    const url = this.config.apiUrl + '/Config/GetConfig?key=' + key;
    const temp = new GetConfigResult();

    if (!bypassCache) {
      return from(this.cacheService.getHttpResponse(temp.cacheKey)).pipe(
        switchMap((cachedResponse) => {
          if (cachedResponse) {
            this.loggerService.logDebug(`Returning a cached response: ${temp.cacheKey} data: ${JSON.stringify(cachedResponse)}`);
            return of(cachedResponse.body);
          } else {
            return this.http.get<GetConfigResult>(url, {
              context:  this.cacheService.setCacheInfoHttpContext(temp),
            });
          }
        }),
        catchError((val) => {
          return this.http.get<GetConfigResult>(url, {
            context:  this.cacheService.setCacheInfoHttpContext(temp),
          });
        })
      );
    } else {
      return this.http.get<GetConfigResult>(url);
    }
  }
}
