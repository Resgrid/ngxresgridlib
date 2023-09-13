import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { CallProtocolsResult } from '../../models/v4/callProtocols/callProtocolsResult';

@Injectable({
  providedIn: 'root',
})
export class CallProtocolsService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public getAllCallPriorites(): Observable<CallProtocolsResult> {
    const url = this.config.apiUrl + '/CallProtocols/GetAllCallProtocols';
    return this.http.get<CallProtocolsResult>(url);
  }
}
