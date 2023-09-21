import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { CalendarItemsResult } from '../../models/v4/calendar/calendarItemsResult';
import { CalendarItemResult } from '../../models/v4/calendar/calendarItemResult';
import { CalendarItemTypesResult } from '../../models/v4/calendar/calendarItemTypesResult';
import { SetCalendarAttendingResult } from '../../models/v4/calendar/setCalendarAttendingResult';


@Injectable({
  providedIn: 'root',
})
export class CalendarService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getDepartmentCalendarItems(): Observable<CalendarItemsResult> {
    const url = this.config.apiUrl + '/Calendar/GetDepartmentCalendarItems';
    return this.http.get<CalendarItemsResult>(url);
  }

  public getDepartmentCalendarItemsInRange(start: string, end: string): Observable<CalendarItemsResult> {
    const url = this.config.apiUrl + '/Calendar/GetDepartmentCalendarItemsInRange?start=' + start + '&end=' + end;
    return this.http.get<CalendarItemsResult>(url);
  }

  public getCalendarItem(id: string): Observable<CalendarItemResult> {
    const url = this.config.apiUrl + '/Calendar/GetCalendarItem?id=' + id;
    return this.http.get<CalendarItemResult>(url);
  }

  public getDepartmentCalendarItemTypes(): Observable<CalendarItemTypesResult> {
    const url = this.config.apiUrl + '/Calendar/GetDepartmentCalendarItemTypes';
    return this.http.get<CalendarItemTypesResult>(url);
  }

  public setCalendarAttendingStatus(calendarEntityId: string, note: string, type: number): Observable<SetCalendarAttendingResult> {
    const url = this.config.apiUrl + `/Calendar/SetCalendarAttendingStatus`;

    return this.http.post<SetCalendarAttendingResult>(url,
        { CalendarEventId: calendarEntityId,
          Note: note,
          Type: type
        }
      );
  }
}
