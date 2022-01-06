import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { FormResult } from '../../models/v4/forms/formResult';


@Injectable({
  providedIn: 'root',
})
export class FormsService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getNewCallForm(): Observable<FormResult> {
    const url = this.config.apiUrl + '/Forms/GetNewCallForm';
    return this.http.get<FormResult>(url);
  }
}
