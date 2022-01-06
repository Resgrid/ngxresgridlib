import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { UnitsResult } from '../../models/v4/units/unitsResult';


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
}
