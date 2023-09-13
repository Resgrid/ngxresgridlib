import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { NewCallFormResult } from '../../models/v4/dispatch/newCallFormResult';
import { GetSetUnitStateResult } from '../../models/v4/dispatch/getSetUnitStateResult';
import { GetPersonnelForCallGridResult } from '../../models/v4/dispatch/getPersonnelForCallGridResult';
import { GetRolesForCallGridResult } from '../../models/v4/dispatch/getRolesForCallGridResult';
import { GetCallTemplatesResult } from '../../models/v4/dispatch/getCallTemplatesResult';
import { GetGroupsForCallGridResult } from '../../models/v4/dispatch/getGroupsForCallGridResult';

@Injectable({
  providedIn: 'root',
})
export class DispatchService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public getNewCallData(): Observable<NewCallFormResult> {
    const url = this.config.apiUrl + '/Dispatch/GetNewCallData';
    return this.http.get<NewCallFormResult>(url);
  }

  public getSetUnitStatusData(
    unitId: string,
  ): Observable<GetSetUnitStateResult> {
    const url =
      this.config.apiUrl + `/Dispatch/GetSetUnitStatusData?unitId=${unitId}`;
    return this.http.get<GetSetUnitStateResult>(url);
  }

  public getPersonnelForCallGrid(): Observable<GetPersonnelForCallGridResult> {
    const url = this.config.apiUrl + '/Dispatch/GetPersonnelForCallGrid';
    return this.http.get<GetPersonnelForCallGridResult>(url);
  }

  public getGroupsForCallGrid(): Observable<GetGroupsForCallGridResult> {
    const url = this.config.apiUrl + '/Dispatch/GetGroupsForCallGrid';
    return this.http.get<GetGroupsForCallGridResult>(url);
  }

  public getRolesForCallGrid(): Observable<GetRolesForCallGridResult> {
    const url = this.config.apiUrl + '/Dispatch/GetRolesForCallGrid';
    return this.http.get<GetRolesForCallGridResult>(url);
  }

  public getCallTemplates(): Observable<GetCallTemplatesResult> {
    const url = this.config.apiUrl + '/Dispatch/GetCallTemplates';
    return this.http.get<GetCallTemplatesResult>(url);
  }
}
