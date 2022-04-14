import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { SavePersonsStaffingsInput } from '../../models/v4/personnelStaffing/savePersonsStaffingsInput';
import { SavePersonsStaffingsResult } from '../../models/v4/personnelStaffing/savePersonsStaffingsResult';
import { SavePersonStaffingInput } from '../../models/v4/personnelStaffing/savePersonStaffingInput';
import { SavePersonStaffingResult } from '../../models/v4/personnelStaffing/savePersonStaffingResult';
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

  public savePersonStatus(data: SavePersonStaffingInput): Observable<SavePersonStaffingResult> {
    const url = this.config.apiUrl + '/PersonnelStaffing/SavePersonStaffing';

    return this.http.post<SavePersonStaffingResult>(url, data);
  }

  public savePersonsStatuses(data: SavePersonsStaffingsInput): Observable<SavePersonsStaffingsResult> {
    const url = this.config.apiUrl + '/PersonnelStaffing/SavePersonsStaffings';

    return this.http.post<SavePersonsStaffingsResult>(url, data);
  }
}