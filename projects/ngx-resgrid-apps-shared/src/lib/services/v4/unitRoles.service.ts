import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { UnitRolesForUnitResult } from '../../models/v4/unitRoles/unitRolesForUnitResult';
import { ActiveUnitRolesResult } from '../../models/v4/unitRoles/activeUnitRolesResult';

@Injectable({
  providedIn: 'root',
})
export class UnitRolesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public getRolesForUnit(unitId: string): Observable<UnitRolesForUnitResult> {
    const url =
      this.config.apiUrl + `/UnitRoles/GetRolesForUnit?unitId=${unitId}`;
    return this.http.get<UnitRolesForUnitResult>(url);
  }

  public getAllUnitRolesAndAssignmentsForDepartment(): Observable<ActiveUnitRolesResult> {
    const url =
      this.config.apiUrl +
      `/UnitRoles/GetAllUnitRolesAndAssignmentsForDepartment`;
    return this.http.get<ActiveUnitRolesResult>(url);
  }
}
