import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { CallProtocolsResult } from '../../models/v4/callProtocols/callProtocolsResult';


@Injectable({
  providedIn: 'root',
})
export class CallProtocolsService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getAllCallProtocols(): Observable<CallProtocolsResult> {
    const url = this.config.apiUrl + '/CallProtocols/GetAllCallProtocols';
    return this.http.get<CallProtocolsResult>(url);
  }

  public getCallProtocolAttachmentFile(attachmentId: string): Observable<any> {
    const url = this.config.apiUrl + '/CallProtocols/GetFile?protocolAttachmentId=' + attachmentId;

    const requestOptions: Object = {
      responseType: 'blob',
      reportProgress: true,
      observe: 'events'
    }
    return this.http.get<any>(url, requestOptions);
  }
}
