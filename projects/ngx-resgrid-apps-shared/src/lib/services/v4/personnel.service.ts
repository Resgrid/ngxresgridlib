import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { PersonnelInfoResult } from '../../models/v4/personnel/personnelInfoResult';

@Injectable({
  providedIn: 'root',
})
export class PersonnelService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public getPersonnelInfo(userId: string): Observable<PersonnelInfoResult> {
    const url =
      this.config.apiUrl + `/Personnel/GetPersonnelInfo?userId=${userId}`;
    return this.http.get<PersonnelInfoResult>(url);
  }
}
