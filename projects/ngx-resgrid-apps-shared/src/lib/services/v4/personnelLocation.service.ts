import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { SavePersonnelLocationInput } from '../../models/v4/personnelLocation/savePersonnelLocationInput';
import { SavePersonnelLocationResult } from '../../models/v4/personnelLocation/savePersonnelLocationResult';
import { PersonnelLocationResult } from '../../models/v4/personnelLocation/personnelLocationResult';

@Injectable({
  providedIn: 'root',
})
export class PersonnelLocationService {
  constructor(public http: HttpClient, private config: ResgridConfig) {}

  public savePersonnelLocation(input: SavePersonnelLocationInput): Observable<SavePersonnelLocationResult> {
    let url = this.config.apiUrl + '/PersonnelLocation/SetPersonLocation';
    return this.http.post<SavePersonnelLocationResult>(url, input);
  }

  public getLatestPersonnelLocation(userId: string): Observable<PersonnelLocationResult> {
    const url = this.config.apiUrl + `/PersonnelLocation/GetLatestPersonLocation?userId=${userId}`;
    return this.http.get<PersonnelLocationResult>(url);
  }
}
