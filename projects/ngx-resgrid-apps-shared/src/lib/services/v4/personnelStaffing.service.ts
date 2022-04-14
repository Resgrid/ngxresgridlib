import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { SavePersonStatusInput } from '../../models/v4/personnelStatuses/savePersonStatusInput';
import { SavePersonStatusResult } from '../../models/v4/personnelStatuses/savePersonStatusResult';
import { SavePersonsStatusesInput } from '../../models/v4/personnelStatuses/savePersonsStatusesInput';
import { SavePersonsStatusesResult } from '../../models/v4/personnelStatuses/savePersonsStatusesResult';


@Injectable({
  providedIn: 'root',
})
export class PersonnelStaffingService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public savePersonStatus(data: SavePersonStatusInput): Observable<SavePersonStatusResult> {
    const url = this.config.apiUrl + '/PersonnelStaffing/SavePersonStaffing';

    if (!data.RespondingTo) {
      data.RespondingTo = '0';
    }

    return this.http.post<SavePersonStatusResult>(url, data);
  }

  public savePersonsStatuses(data: SavePersonsStatusesInput): Observable<SavePersonsStatusesResult> {
    const url = this.config.apiUrl + '/PersonnelStaffing/SavePersonsStaffings';

    if (!data.RespondingTo) {
      data.RespondingTo = '0';
    }

    return this.http.post<SavePersonsStatusesResult>(url, data);
  }
}
