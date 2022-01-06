import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { RolesResult } from '../../models/v4/roles/rolesResult';


@Injectable({
  providedIn: 'root',
})
export class RolesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getAllRoles(): Observable<RolesResult> {
    const url = this.config.apiUrl + '/Roles/GetAllRoles';
    return this.http.get<RolesResult>(url);
  }
}
