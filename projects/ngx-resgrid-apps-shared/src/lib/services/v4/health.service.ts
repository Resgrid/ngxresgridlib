import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { HealthResult } from '../../models/v4/health/healthResult';


@Injectable({
  providedIn: 'root',
})
export class HealthService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getCurrent(): Observable<HealthResult> {
    const url = this.config.apiUrl + `/Health/GetCurrent`;
    return this.http.get<HealthResult>(url);
  }

  public getCurrentForCustomServer(baseApiUrl: string): Observable<HealthResult> {
    const url = `${baseApiUrl}/api/${this.config.apiVersion}` + `/Health/GetCurrent`;
    return this.http.get<HealthResult>(url);
  }
}
