import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { GpsLocation } from '../../models/gpsLocation';
import { CallFilesResult } from '../../models/v4/callFiles/callFilesResult';
import { SaveCallFileResult } from '../../models/v4/callFiles/saveCallFileResult';

@Injectable({
  providedIn: 'root',
})
export class CallFilesService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig
  ) {}

  public getCallImages(
    callId: string,
    includeData: boolean
  ): Observable<CallFilesResult> {
    return this.getFiles(callId, includeData, 2);
  }

  public getCallFiles(
    callId: string,
    includeData: boolean
  ): Observable<CallFilesResult> {
    return this.getFiles(callId, includeData, 3);
  }

  public getCallAudio(
    callId: string,
    includeData: boolean
  ): Observable<CallFilesResult> {
    return this.getFiles(callId, includeData, 1);
  }

  public getFiles(
    callId: string,
    includeData: boolean,
    type: number
  ): Observable<CallFilesResult> {
    const url = this.config.apiUrl + `/CallFiles/GetFilesForCall`;
    let params = new HttpParams()
      .append('callId', callId.toString())
      .append('includeData', includeData.toString())
      .append('type', type.toString());

    return this.http
      .get<CallFilesResult>(
        url,
        { params: params }
      );
  }

  public saveCallImage(
    callId: string,
    userId: string,
    note: string,
    name: string,
    location: GpsLocation,
    file: string
  ): Observable<SaveCallFileResult> {
    return this.saveFile(callId, userId, note, name, location, file, 2);
  }

  public saveCallFile(
    callId: string,
    userId: string,
    note: string,
    name: string,
    location: GpsLocation,
    file: string
  ): Observable<SaveCallFileResult> {
    return this.saveFile(callId, userId, note, name, location, file, 3);
  }

  public saveFile(
    callId: string,
    userId: string,
    note: string,
    name: string,
    location: GpsLocation,
    file: string,
    type: number
  ): Observable<SaveCallFileResult> {
    const url = this.config.apiUrl + `/CallFiles/SaveCallFile`;

    let data = {
      CallId: callId,
      UserId: userId,
      Type: type,
      Name: name,
      Latitude: "",
      Longitude: "",
      Note: note,
      Data: file,
    };

    if (location && location != null) {
      data.Latitude = location.Latitude.toString();
      data.Longitude = location.Longitude.toString();
    }

    return this.http.post<SaveCallFileResult>(url, data);
  }
}
