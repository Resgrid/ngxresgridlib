import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ResgridConfig } from '../../resgrid-config';
import { GetMapDataAndMarkersResult } from '../../models/v4/mapping/getMapDataAndMarkersResult';

@Injectable({
  providedIn: 'root',
})
export class MappingService {
  constructor(
    public http: HttpClient,
    private config: ResgridConfig,
  ) {}

  public getMapDataAndMarkers(): Observable<GetMapDataAndMarkersResult> {
    const url = this.config.apiUrl + '/Mapping/GetMapDataAndMarkers';
    return this.http.get<GetMapDataAndMarkersResult>(url);
  }
}
