import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { GroupResult } from '../../models/v4/groups/groupResult';
import { GroupsResult } from '../../models/v4/groups/groupsResult';


@Injectable({
  providedIn: 'root',
})
export class GroupsService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getGroup(groupId: string): Observable<GroupResult> {
    const url = this.config.apiUrl + `/Groups/GetGroup?groupId=${groupId}`;
    return this.http.get<GroupResult>(url);
  }

  public getallGroups(): Observable<GroupsResult> {
    const url = this.config.apiUrl + `/Groups/GetAllGroups`;
    return this.http.get<GroupsResult>(url);
  }
}
