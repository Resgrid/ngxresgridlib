import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { UnitRolesForUnitResult } from '../../models/v4/unitRoles/unitRolesForUnitResult';
import { ActiveUnitRolesResult } from '../../models/v4/unitRoles/activeUnitRolesResult';
import { SetUnitRolesInput } from '../../models/v4/unitRoles/setUnitRolesInput';
import { SetRoleAssignmentsForUnitResult } from '../../models/v4/unitRoles/setRoleAssignmentsForUnitResult';


@Injectable({
  providedIn: 'root',
})
export class UnitRolesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getRolesForUnit(unitId: string): Observable<UnitRolesForUnitResult> {
    const url = this.config.apiUrl + `/UnitRoles/GetRolesForUnit?unitId=${unitId}`;
    return this.http.get<UnitRolesForUnitResult>(url);
  }

  public getRoleAssignmentsForUnit(unitId: string): Observable<ActiveUnitRolesResult> {
    const url = this.config.apiUrl + `/UnitRoles/GetRoleAssignmentsForUnit?unitId=${unitId}`;
    return this.http.get<ActiveUnitRolesResult>(url);
  }

  public setRoleAssignmentsForUnit(data: SetUnitRolesInput): Observable<SetRoleAssignmentsForUnitResult> {
    const url = this.config.apiUrl + '/UnitRoles/SetRoleAssignmentsForUnit';

    return this.http.post<SetRoleAssignmentsForUnitResult>(url, data);
  }

  public getAllUnitRolesAndAssignmentsForDepartment(): Observable<ActiveUnitRolesResult> {
    const url = this.config.apiUrl + `/UnitRoles/GetAllUnitRolesAndAssignmentsForDepartment`;
    return this.http.get<ActiveUnitRolesResult>(url);
  }
}
