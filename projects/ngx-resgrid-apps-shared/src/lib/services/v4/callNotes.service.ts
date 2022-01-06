import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { CallNotesResult } from '../../models/v4/callNotes/callNotesResult';
import { GpsLocation } from '../../models/gpsLocation';
import { SaveCallNoteResult } from '../../models/v4/callNotes/saveCallNoteResult';

@Injectable({
  providedIn: 'root',
})
export class CallNotesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getCallNotes(callId: string): Observable<CallNotesResult> {
    const url = this.config.apiUrl + `/CallNotes/GetCallNotes?callId=${callId}`;
    return this.http.get<CallNotesResult>(url);
  }

  public saveCallNote(
    callId: string,
    userId: string,
    note: string,
    location: GpsLocation
  ): Observable<SaveCallNoteResult> {
    let url = this.config.apiUrl + '/CallNotes/SaveCallNote';

    let data = {
      CallId: callId,
      UserId: userId,
      Note: note,
      Latitude: "",
      Longitude: ""
    };

    if (location && location != null) {
      data.Latitude = location.Latitude.toString();
      data.Longitude = location.Longitude.toString();
    }

    return this.http.post<SaveCallNoteResult>(url, data);
  }
}
