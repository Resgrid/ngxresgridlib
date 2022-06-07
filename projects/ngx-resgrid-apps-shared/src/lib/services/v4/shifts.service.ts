import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { MessagesResult } from '../../models/v4/messages/messagesResult';
import { MessageResult } from '../../models/v4/messages/messageResult';
import { SendMessageResult } from '../../models/v4/messages/sendMessageResult';
import { MessageRecipientInput } from '../../models/v4/messages/messageRecipientInput';
import { RespondToMessageResult } from '../../models/v4/messages/respondToMessageResult';
import { DeleteMessageResult } from '../../models/v4/messages/deleteMessageResult';
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
    const url = this.config.apiUrl + '/Shift/GetShifts';
    return this.http.get<ShiftsResult>(url);
  }

  public getShift(shiftId: string): Observable<ShiftResult> {
    const url = this.config.apiUrl + '/Shift/GetShift?id=' + shiftId;
    return this.http.get<ShiftResult>(url);
  }

  public getTodaysShifts(): Observable<ShiftDaysResult> {
    const url = this.config.apiUrl + '/Shift/GetTodaysShifts';
    return this.http.get<ShiftDaysResult>(url);
  }

  public getShiftDay(shiftDayId: string): Observable<ShiftDayResult> {
    const url = this.config.apiUrl + '/Shift/GetShiftDay?id=' + shiftDayId;
    return this.http.get<ShiftDayResult>(url);
  }

  public signupForShiftDay(shiftDayId: string, groupId: string): Observable<SignupShiftDayResult> {
    const url = this.config.apiUrl + '/Shift/SignupForShiftDay';
    return this.http.post<SignupShiftDayResult>(url, {
      ShiftDayId: shiftDayId,
      GroupId: groupId
    });
  }
}
