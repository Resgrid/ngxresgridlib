import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { StatusesResult } from '../../models/v4/statuses/statusesResult';
import { UnitTypeStatusesResult } from '../../models/v4/statuses/unitTypeStatusesResult';


@Injectable({
  providedIn: 'root',
})
export class StatusesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getAllStatusesForPersonnel(): Observable<StatusesResult> {
    const url = this.config.apiUrl + '/Statuses/GetAllStatusesForPersonnel';
    return this.http.get<StatusesResult>(url);
  }

  public getAllStaffingsForPersonnel(): Observable<StatusesResult> {
    const url = this.config.apiUrl + '/Statuses/GetAllStaffingsForPersonnel';
    return this.http.get<StatusesResult>(url);
  }

  public getAllUnitStatuses(): Observable<UnitTypeStatusesResult> {
    const url = this.config.apiUrl + '/Statuses/GetAllUnitStatuses';
    return this.http.get<UnitTypeStatusesResult>(url);
  }
}
