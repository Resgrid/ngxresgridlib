import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { PersonnelInfoResult } from '../../models/v4/personnel/personnelInfoResult';
import { GetAllPersonnelInfosResult } from '../../models/v4/personnel/getAllPersonnelInfosResult';
import { GetPersonnelFilterOptionsResult } from '../../models/v4/personnel/getPersonnelFilterOptionsResult';


@Injectable({
  providedIn: 'root',
})
export class PersonnelService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getPersonnelInfo(userId: string): Observable<PersonnelInfoResult> {
    const url = this.config.apiUrl + `/Personnel/GetPersonnelInfo?userId=${userId}`;
    return this.http.get<PersonnelInfoResult>(url);
  }

  public getAllPersonnelInfos(filter: string): Observable<GetAllPersonnelInfosResult> {
    let url = '';
    
    if (filter) {
      url = this.config.apiUrl + `/Personnel/GetAllPersonnelInfos?activeFilter=${encodeURIComponent(filter)}`;
    } else {
      url = this.config.apiUrl + `/Personnel/GetAllPersonnelInfos`;
    }
    
    return this.http.get<GetAllPersonnelInfosResult>(url);
  }

  public getPersonnelFilterOptions(): Observable<GetPersonnelFilterOptionsResult> {
    const url = this.config.apiUrl + `/Personnel/GetPersonnelFilterOptions`;
    return this.http.get<GetPersonnelFilterOptionsResult>(url);
  }
}
