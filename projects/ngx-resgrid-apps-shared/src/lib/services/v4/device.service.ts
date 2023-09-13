import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { PushRegistrationResult } from '../../models/v4/device/pushRegistrationResult';

@Injectable({
  providedIn: 'root',
})
export class DeviceService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public RegisterUnitPush(
    token: string,
    unitId: string,
    deviceId: string,
    platform: number,
  ): Observable<PushRegistrationResult> {
    const url = this.config.apiUrl + '/Devices/RegisterUnitDevice';

    return this.http.post<PushRegistrationResult>(url, {
      Platform: platform,
      Token: token,
      UnitId: unitId,
      DeviceUuid: deviceId,
    });
  }

  public UnRegisterUnitPush(
    deviceId: string,
  ): Observable<PushRegistrationResult> {
    const url =
      this.config.apiUrl +
      '/Devices/UnRegisterUnitDevice?deviceUuid=' +
      deviceId;
    return this.http.delete<PushRegistrationResult>(url);
  }
}
