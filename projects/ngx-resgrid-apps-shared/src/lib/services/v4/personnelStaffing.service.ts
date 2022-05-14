import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { SavePersonsStaffingsInput } from '../../models/v4/personnelStaffing/savePersonsStaffingsInput';
import { SavePersonsStaffingsResult } from '../../models/v4/personnelStaffing/savePersonsStaffingsResult';
import { SavePersonStaffingInput } from '../../models/v4/personnelStaffing/savePersonStaffingInput';
import { SavePersonStaffingResult } from '../../models/v4/personnelStaffing/savePersonStaffingResult';
import { GetCurrentStaffingResult } from '../../models/v4/personnelStaffing/getCurrentStaffingResult';

@Injectable({
  providedIn: 'root',
})
export class PersonnelStaffingService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getCurrentStatffing(userId: string): Observable<GetCurrentStaffingResult> {
    const url = this.config.apiUrl + `/PersonnelStaffing/GetCurrentStatffing?userId=${userId}`;
    return this.http.get<GetCurrentStaffingResult>(url);
  }

  public savePersonStaffing(data: SavePersonStaffingInput): Observable<SavePersonStaffingResult> {
    const url = this.config.apiUrl + '/PersonnelStaffing/SavePersonStaffing';

    return this.http.post<SavePersonStaffingResult>(url, data);
  }

  public savePersonsStaffings(data: SavePersonsStaffingsInput): Observable<SavePersonsStaffingsResult> {
    const url = this.config.apiUrl + '/PersonnelStaffing/SavePersonsStaffings';

    return this.http.post<SavePersonsStaffingsResult>(url, data);
  }
}
