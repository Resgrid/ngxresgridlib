import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { map, tap } from 'rxjs/operators';
import { DepartmentRightsResult } from '../../models/v4/security/departmentRightsResult';

@Injectable({
  providedIn: 'root',
})
export class SecurityService {
  private groupRights: any[] = [];
  private departmentAdmin: boolean = false;
  private canCreateCalls: boolean = false;
  private canCreateNotes: boolean = false;
  private canViewPII: boolean = false;
  private canCreateMessages: boolean = false;

  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public applySecurityRights(): Observable<DepartmentRightsResult> {
    return this.getCurrentUsersRights().pipe(
      tap((data) => this.setRights(data)),
    );
  }

  private setRights(data: DepartmentRightsResult): void {
    this.departmentAdmin = data.Data.IsAdmin;
    this.groupRights = data.Data.Groups;

    if (data.Data.CanViewPII) {
      this.canViewPII = true;
    }

    if (data.Data.CanCreateCalls) {
      this.canCreateCalls = true;
    }

    if (data.Data.CanAddNote) {
      this.canCreateNotes = true;
    }

    if (data.Data.CanCreateMessage) {
      this.canCreateMessages = true;
    }

    if (data.Data.IsAdmin) {
      this.canViewPII = true;
      this.canCreateCalls = true;
      this.canCreateNotes = true;
      this.canCreateMessages = true;
    }
  }

  private getCurrentUsersRights(): Observable<DepartmentRightsResult> {
    const url = this.config.apiUrl + '/Security/GetCurrentUsersRights';
    return this.http.get<DepartmentRightsResult>(url);
  }

  public isUserDepartmentAdmin(): boolean {
    return this.departmentAdmin;
  }

  public isUserGroupAdmin(groupId: string): boolean {
    if (this.groupRights && this.groupRights.length > 0) {
      for (let i = 0; i < this.groupRights.length; i++) {
        if (this.groupRights[i].Gid === groupId) {
          return this.groupRights[i].Adm;
        }
      }
    }

    return false;
  }

  public canUserCreateCalls(): boolean {
    return this.canCreateCalls;
  }

  public canUserCreateNotes(): boolean {
    return this.canCreateNotes;
  }

  public canUserCreateMessages(): boolean {
    return this.canCreateMessages;
  }

  public canUserViewPII(): boolean {
    return this.canViewPII;
  }
}
