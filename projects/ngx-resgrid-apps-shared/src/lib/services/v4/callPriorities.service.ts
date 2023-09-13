import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { CallPrioritiesResult } from '../../models/v4/callPriorities/callPrioritiesResult';

@Injectable({
  providedIn: 'root',
})
export class CallPrioritiesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public getAllCallPriorites(): Observable<CallPrioritiesResult> {
    const url = this.config.apiUrl + '/CallPriorities/GetAllCallPriorites';
    return this.http.get<CallPrioritiesResult>(url);
  }
}
