import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { SaveUnitLocationInput } from '../../models/v4/unitLocation/saveUnitLocationInput';
import { SaveUnitLocationResult } from '../../models/v4/unitLocation/saveUnitLocationResult';
import { UnitLocationResult } from '../../models/v4/unitLocation/unitLocationResult';

@Injectable({
  providedIn: 'root',
})
export class UnitLocationService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public saveUnitLocation(
    input: SaveUnitLocationInput,
  ): Observable<SaveUnitLocationResult> {
    let url = this.config.apiUrl + '/UnitLocation/SetUnitLocation';
    return this.http.post<SaveUnitLocationResult>(url, input);
  }

  public getLatestUnitLocation(unitId: string): Observable<UnitLocationResult> {
    const url =
      this.config.apiUrl +
      `/UnitLocation/GetLatestUnitLocation?unitId=${unitId}`;
    return this.http.get<UnitLocationResult>(url);
  }
}
