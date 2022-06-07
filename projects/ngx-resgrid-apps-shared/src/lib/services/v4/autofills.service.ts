import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { AutofillsResult } from '../../models/v4/autofills/autofillsResult';


@Injectable({
  providedIn: 'root',
})
export class AutofillsService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getAllAutofills(): Observable<AutofillsResult> {
    const url = this.config.apiUrl + '/Autofills/GetAllAutofills';
    return this.http.get<AutofillsResult>(url);
  }

  public getAutofillsForType(type: number): Observable<AutofillsResult> {
    const url = this.config.apiUrl + '/Autofills/GetAutofillsForType?type=' + type;
    return this.http.get<AutofillsResult>(url);
  }
}
