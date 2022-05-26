import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { UnitsResult } from '../../models/v4/units/unitsResult';
import { GetUnitFilterOptionsResult } from '../../models/v4/units/getUnitFilterOptionsResult';
import { UnitsInfoResult } from '../../models/v4/units/unitInfoResult';


@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getAllUnits(): Observable<UnitsResult> {
    const url = this.config.apiUrl + `/Units/GetAllUnits`;
    return this.http.get<UnitsResult>(url);
  }

  public getAllUnitsInfos(filter: string): Observable<UnitsInfoResult> {
    let url = '';
    
    if (filter) {
      url = this.config.apiUrl + `/Units/GetAllUnitsInfos?activeFilter=${encodeURIComponent(filter)}`;
    } else {
      url = this.config.apiUrl + `/Units/GetAllUnitsInfos`;
    }
    
    return this.http.get<UnitsInfoResult>(url);
  }

  public getUnitsFilterOptions(): Observable<GetUnitFilterOptionsResult> {
    const url = this.config.apiUrl + `/Units/GetUnitsFilterOptions`;
    return this.http.get<GetUnitFilterOptionsResult>(url);
  }
}
