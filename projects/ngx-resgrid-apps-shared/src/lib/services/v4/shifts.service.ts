import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { ShiftsResult } from '../../models/v4/shifts/shiftsResult';
import { ShiftResult } from '../../models/v4/shifts/shiftResult';
import { ShiftDaysResult } from '../../models/v4/shifts/shiftDaysResult';
import { ShiftDayResult } from '../../models/v4/shifts/shiftDayResult';
import { SignupShiftDayResult } from '../../models/v4/shifts/signupShiftDayResult';


@Injectable({
  providedIn: 'root',
})
export class ShiftsService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getShifts(): Observable<ShiftsResult> {
    const url = this.config.apiUrl + '/Shifts/GetShifts';
    return this.http.get<ShiftsResult>(url);
  }

  public getShift(shiftId: string): Observable<ShiftResult> {
    const url = this.config.apiUrl + '/Shifts/GetShift?id=' + shiftId;
    return this.http.get<ShiftResult>(url);
  }

  public getTodaysShifts(): Observable<ShiftDaysResult> {
    const url = this.config.apiUrl + '/Shifts/GetTodaysShifts';
    return this.http.get<ShiftDaysResult>(url);
  }

  public getShiftDay(shiftDayId: string): Observable<ShiftDayResult> {
    const url = this.config.apiUrl + '/Shifts/GetShiftDay?id=' + shiftDayId;
    return this.http.get<ShiftDayResult>(url);
  }

  public signupForShiftDay(shiftDayId: string, groupId: string): Observable<SignupShiftDayResult> {
    const url = this.config.apiUrl + '/Shifts/SignupForShiftDay';
    return this.http.post<SignupShiftDayResult>(url, {
      ShiftDayId: shiftDayId,
      GroupId: groupId
    });
  }
}
