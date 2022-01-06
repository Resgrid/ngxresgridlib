import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { ActiveCallsResult } from '../../models/v4/calls/activeCallsResult';
import { ScheduledCallsResult } from '../../models/v4/calls/scheduledCallsResult';
import { SaveCallResult } from '../../models/v4/calls/saveCallResult';
import { CallExtraDataResult } from '../../models/v4/calls/callExtraDataResult';
import { UpdateCallResult } from '../../models/v4/calls/updateCallResult';
import { UpdateDispatchTimeResult } from '../../models/v4/calls/updateDispatchTimeResult';
import { DeleteCallResult } from '../../models/v4/calls/deleteCallResult';
import { CloseCallResult } from '../../models/v4/calls/closeCallResult';
import { CallResult } from '../../models/v4/calls/callResult';

@Injectable({
  providedIn: 'root',
})
export class CallsService {
  constructor(public http: HttpClient, private config: ResgridConfig) {}

  public getActiveCalls(): Observable<ActiveCallsResult> {
    const url = this.config.apiUrl + '/Calls/GetActiveCalls';
    return this.http.get<ActiveCallsResult>(url);
  }

  public getCall(callId: string): Observable<CallResult> {
    const url = this.config.apiUrl + `/Calls/GetCall?callId=${callId}`;
    return this.http.get<CallResult>(url);
  }

  public getAllPendingScheduledCalls(): Observable<ScheduledCallsResult> {
    const url = this.config.apiUrl + `/Calls/GetAllPendingScheduledCalls`;
    return this.http.get<ScheduledCallsResult>(url);
  }

  public getCallExtraData(callId: string): Observable<CallExtraDataResult> {
    const url = this.config.apiUrl + `/Calls/GetCallExtraData?callId=${callId}`;
    return this.http.get<CallExtraDataResult>(url);
  }

  public saveCall(
    name: string,
    priority: number,
    type: string,
    contactName: string,
    contactInfo: string,
    externalId: string,
    incidentId: string,
    referenceId: string,
    nature: string,
    notes: string,
    address: string,
    w3w: string,
    latitude: number,
    longitude: number,
    dispatchList: string,
    dispatchOn: string,
    callFormData: string
  ): Observable<SaveCallResult> {
    let url = this.config.apiUrl + '/Calls/SaveCall';

    return this.http.post<SaveCallResult>(url, {
      Priority: priority,
      Type: type,
      ContactName: contactName,
      ContactInfo: contactInfo,
      ExternalId: externalId,
      IncidentId: incidentId,
      ReferenceId: referenceId,
      Name: name,
      Nature: nature,
      Note: notes,
      Geolocation: `${latitude},${longitude}`,
      Address: address,
      What3Words: w3w,
      DispatchList: dispatchList,
      DispatchOn: dispatchOn,
      CallFormData: callFormData,
    });
  }

  public updateCall(
    callId: string,
    name: string,
    priority: number,
    type: string,
    contactName: string,
    contactInfo: string,
    externalId: string,
    incidentId: string,
    referenceId: string,
    nature: string,
    notes: string,
    address: string,
    w3w: string,
    latitude: number,
    longitude: number,
    dispatchList: string,
    dispatchOn: string,
    callFormData: string,
    redispatch: boolean
  ): Observable<UpdateCallResult> {
    let url = this.config.apiUrl + '/Calls/EditCall';
    let coordinates = '';
    if (latitude && latitude != 0 && longitude && longitude != 0) {
      coordinates = latitude + ',' + longitude;
    }

    return this.http.put<UpdateCallResult>(url, {
      Id: callId,
      Priority: priority,
      Type: type,
      ContactName: contactName,
      ContactInfo: contactInfo,
      ExternalId: externalId,
      IncidentId: incidentId,
      ReferenceId: referenceId,
      Name: name,
      Nature: nature,
      Note: notes,
      Geolocation: `${latitude},${longitude}`,
      Address: address,
      What3Words: w3w,
      DispatchList: dispatchList,
      DispatchOn: dispatchOn,
      CallFormData: callFormData,
      RebroadcastCall: redispatch,
    });
  }

  public updateCallDisptachTime(
    callId: string,
    date: string
  ): Observable<UpdateDispatchTimeResult> {
    let url = this.config.apiUrl + '/Calls/UpdateScheduledDispatchTime';

    return this.http.put<UpdateDispatchTimeResult>(url, {
      Id: callId,
      Date: date
    });
  }

  public deleteCall(
    callId: string
  ): Observable<DeleteCallResult> {
    let url = this.config.apiUrl + `/Calls/DeleteCall?callId=${callId}`;

    return this.http.delete<DeleteCallResult>(url);
  }

  public closeCall(callId: string, note: string, type: number): Observable<CloseCallResult> {
    let url = this.config.apiUrl + `/Calls/CloseCall`;

    return this.http.put<CloseCallResult>(url, {
      Id: callId,
      Notes: note,
      Type: type
    });
  }
}
