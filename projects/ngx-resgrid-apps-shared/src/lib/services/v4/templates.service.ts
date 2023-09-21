import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { CallNoteTemplatesResult } from '../../models/v4/templates/callNoteTemplatesResult';


@Injectable({
  providedIn: 'root',
})
export class TemplatesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getAllCallNoteTemplates(): Observable<CallNoteTemplatesResult> {
    const url = this.config.apiUrl + '/Templates/GetAllCallNoteTemplates';
    return this.http.get<CallNoteTemplatesResult>(url);
  }
}
