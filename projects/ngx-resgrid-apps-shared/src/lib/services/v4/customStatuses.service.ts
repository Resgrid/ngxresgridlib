import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { CustomStatusesResult } from '../../models/v4/customStatuses/customStatusesResult';

@Injectable({
  providedIn: 'root',
})
export class CustomStatusesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public getAllCustomStatuses(): Observable<CustomStatusesResult> {
    const url = this.config.apiUrl + '/CustomStatuses/GetAllCustomStatuses';
    return this.http.get<CustomStatusesResult>(url);
  }

  public getActivePersonnelStatuses(): Observable<CustomStatusesResult> {
    const url =
      this.config.apiUrl + '/CustomStatuses/GetActivePersonnelStatuses';
    return this.http.get<CustomStatusesResult>(url);
  }

  public getActivePersonnelStaffingLevels(): Observable<CustomStatusesResult> {
    const url =
      this.config.apiUrl + '/CustomStatuses/GetActivePersonnelStaffingLevels';
    return this.http.get<CustomStatusesResult>(url);
  }

  public getActiveUnitStatesLevels(): Observable<CustomStatusesResult> {
    const url =
      this.config.apiUrl + '/CustomStatuses/GetActiveUnitStatesLevels';
    return this.http.get<CustomStatusesResult>(url);
  }
}
