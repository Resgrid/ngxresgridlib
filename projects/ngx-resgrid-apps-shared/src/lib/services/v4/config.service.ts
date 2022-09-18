import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { GetConfigResult } from '../../models/v4/configs/getConfigResult';


@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getConfig(key: string): Observable<GetConfigResult> {
    const url = this.config.apiUrl + '/Config/GetConfig?key=' + key;
    return this.http.get<GetConfigResult>(url);
  }
}
