import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { UnitStatusesResult } from '../../models/v4/unitStatus/unitStatusesResult';
import { SaveUnitStatusInput } from '../../models/v4/unitStatus/saveUnitStatusInput';
import { SaveUnitStatusResult } from '../../models/v4/unitStatus/saveUnitStatusResult';
import { UnitStatusResult } from '../../models/v4/unitStatus/unitStatusResult';


@Injectable({
  providedIn: 'root',
})
export class UnitStatusService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getAllUnitStatuses(): Observable<UnitStatusesResult> {
    const url = this.config.apiUrl + '/UnitStatus/GetAllUnitStatuses';
    return this.http.get<UnitStatusesResult>(url);
  }

  public getUnitStatus(unitId: string): Observable<UnitStatusResult> {
    const url = this.config.apiUrl + `/UnitStatus/GetUnitStatus?unitId=${unitId}`;
    return this.http.get<UnitStatusResult>(url);
  }

  public saveUnitStatus(data: SaveUnitStatusInput): Observable<SaveUnitStatusResult> {
    const url = this.config.apiUrl + '/UnitStatus/SaveUnitStatus';

    if (!data.RespondingTo) {
      data.RespondingTo = '0';
    }

    return this.http.post<SaveUnitStatusResult>(url, data);
  }
}
