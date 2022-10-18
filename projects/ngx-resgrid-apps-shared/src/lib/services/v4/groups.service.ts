import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { from, Observable, of } from 'rxjs';
import { switchMap, catchError } from 'rxjs/operators';
import { ResgridConfig } from '../../resgrid-config';
import { GroupResult } from '../../models/v4/groups/groupResult';
import { GroupsResult } from '../../models/v4/groups/groupsResult';
import { CacheService } from '../cache.service';
import { LoggerService } from '../logger.service';


@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
    private cacheService: CacheService, 
    private loggerService: LoggerService
  ) {}

  public getGroup(groupId: string): Observable<GroupResult> {
    const url = this.config.apiUrl + `/Groups/GetGroup?groupId=${groupId}`;
    return this.http.get<GroupResult>(url);
  }

  public getallGroups(): Observable<GroupsResult> {
    const url = this.config.apiUrl + `/Groups/GetAllGroups`;
    const temp = new GroupsResult();

    return from(this.cacheService.getHttpResponse(temp.cacheKey)).pipe(
      switchMap((cachedResponse) => {
        if (cachedResponse) {
          this.loggerService.logDebug(`Returning a cached response: ${temp.cacheKey} data: ${JSON.stringify(cachedResponse)}`);
          return of(cachedResponse.body);
        } else {
          return this.http.get<GroupsResult>(url, {
            context:  this.cacheService.setCacheInfoHttpContext(temp),
          });
        }
      }),
      catchError((val) => {
        return this.http.get<GroupsResult>(url, {
          context:  this.cacheService.setCacheInfoHttpContext(temp),
        });
      })
    );

    return this.http.get<GroupsResult>(url);
  }
}
