import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { CallTypesResult } from '../../models/v4/callTypes/callTypesResult';


@Injectable({
  providedIn: 'root',
})
export class CallTypesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getAllCallTypes(): Observable<CallTypesResult> {
    const url = this.config.apiUrl + '/CallTypes/GetAllCallTypes';
    return this.http.get<CallTypesResult>(url);
  }
}
