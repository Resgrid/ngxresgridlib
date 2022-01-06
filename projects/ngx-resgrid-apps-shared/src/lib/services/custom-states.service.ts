import { Injectable } from '@angular/core';

import { Consts } from '../consts';
import { CustomStatusResultData } from '../models/v4/customStatuses/customStatusResultData';
import { CustomStatusesService } from './v4/customStatuses.service';

@Injectable({
  providedIn: 'root',
})
export class CustomStatesService {
  private statuses: CustomStatusResultData[] = [];

  constructor(
    private consts: Consts,
    private customStatusesService: CustomStatusesService
  ) {}

  public init() {
    this.customStatusesService.getAllCustomStatuses().subscribe((statuses) => {
      if (statuses && statuses.Data && statuses.Data.length > 0) {
        this.statuses = statuses.Data;
      }
    });
  }

  public getPersonnelStatuses(): CustomStatusResultData[] {
    return this.getCustomStatuses(this.consts.CUSTOMTYPES.PERSONNEL, false);
  }

  public getActivePersonnelStatuses(): CustomStatusResultData[] {
    return this.getCustomStatuses(this.consts.CUSTOMTYPES.PERSONNEL, true);
  }

  public getPersonnelStaffing(): CustomStatusResultData[] {
    return this.getCustomStatuses(this.consts.CUSTOMTYPES.STAFFING, false);
  }

  public getActivePersonnelStaffing(): CustomStatusResultData[] {
    return this.getCustomStatuses(this.consts.CUSTOMTYPES.STAFFING, true);
  }

  public getUnitStates(): CustomStatusResultData[] {
    return this.getCustomStatuses(this.consts.CUSTOMTYPES.UNIT, false);
  }

  public getActiveUnitStates(): CustomStatusResultData[] {
    return this.getCustomStatuses(this.consts.CUSTOMTYPES.UNIT, true);
  }

  private getCustomStatuses(customType: any, activeOnly: boolean) {
    const filteredStatuses: CustomStatusResultData[] = new Array<CustomStatusResultData>();

    if (this.statuses) {
      this.statuses.forEach((element) => {
        if (activeOnly) {
          if (element.Type === customType && element.IsDeleted === false) {
            filteredStatuses.push(element);
          }
        } else {
          if (element.Type === customType) {
            filteredStatuses.push(element);
          }
        }
      });
    }

    return filteredStatuses;
  }
}
