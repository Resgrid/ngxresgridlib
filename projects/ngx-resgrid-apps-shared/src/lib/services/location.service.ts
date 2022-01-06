import { Injectable } from '@angular/core';
import {
  bindCallback,
  ConnectableObservable,
  Observable,
  of,
  ReplaySubject,
  throwError,
} from 'rxjs';
import { map, multicast, switchMap } from 'rxjs/operators';
import { GpsLocation } from '../models/gpsLocation';
import { Coordinate } from 'tsgeo/Coordinate';
import { Vincenty } from 'tsgeo/Distance/Vincenty';
import { WindowRef } from './window.service';
import { DocumentRef } from './document.service';
import { ResgridConfig } from '../resgrid-config';

@Injectable({
  providedIn: 'root',
})
export class LocationService {
  protected readonly geocoder$: Observable<google.maps.Geocoder>;

  constructor(loader: LazyGoogleMapsAPILoader) {
    const connectableGeocoder$ = new Observable((subscriber) => {
      loader.load().then(() => subscriber.next());
    }).pipe(
      map(() => this._createGeocoder()),
      multicast(new ReplaySubject(1))
    ) as ConnectableObservable<google.maps.Geocoder>;

    connectableGeocoder$.connect(); // ignore the subscription
    // since we will remain subscribed till application exits

    this.geocoder$ = connectableGeocoder$;
  }

  private _createGeocoder() {
    return new google.maps.Geocoder();
  }

  private _getGoogleResults(
    geocoder: google.maps.Geocoder,
    request: google.maps.GeocoderRequest
  ): Observable<google.maps.GeocoderResult[]> {
    const geocodeObservable = bindCallback(geocoder.geocode);
    return geocodeObservable(request).pipe(
      switchMap(([results, status]) => {
        if (status === google.maps.GeocoderStatus.OK) {
          return of(results);
        }

        return throwError(status);
      })
    );
  }

  private geocode(request: google.maps.GeocoderRequest): Observable<google.maps.GeocoderResult[]> {
    return this.geocoder$.pipe(
      switchMap((geocoder) => this._getGoogleResults(geocoder, request))
    );
  }

  public getCoordinatesForAddressFromGoogle(address: string): Observable<GpsLocation | null> {
    return this.geocode({ address: address }).pipe(
      map((data) => {
        if (data && data.length > 0) {
          return new GpsLocation(
            data[0].geometry.location.lat(),
            data[0].geometry.location.lng()
          );
        }

        return null;
      })
    );
  }


  public getDistanceBetweenTwoPoints(
    point1: GpsLocation,
    point2: GpsLocation
  ): number {
    let coordinate1 = new Coordinate(point1.Latitude, point1.Longitude);
    let coordinate2 = new Coordinate(point2.Latitude, point2.Longitude);

    let calculator = new Vincenty();
    return calculator.getDistance(coordinate1, coordinate2);
  }
}

@Injectable({
  providedIn: 'root',
})
export class LazyGoogleMapsAPILoader {
  protected _scriptLoadingPromise: any;
  protected _windowRef: WindowRef;
  protected _documentRef: DocumentRef;
  protected readonly _SCRIPT_ID: string = 'googleMapsApiScript';
  protected readonly callbackName: string = `lazyMapsAPILoader`;

  constructor(w: WindowRef, d: DocumentRef, private config: ResgridConfig) {
    this._windowRef = w;
    this._documentRef = d;
  }

  load(): Promise<void> {
    const window = this._windowRef.nativeWindow() as any;
    if (window.google && window.google.maps) {
      // Google maps already loaded on the page.
      return Promise.resolve();
    }

    if (this._scriptLoadingPromise) {
      return this._scriptLoadingPromise;
    }

    // this can happen in HMR situations or Stackblitz.io editors.
    const scriptOnPage = this._documentRef
      .nativeDocument()
      .getElementById(this._SCRIPT_ID);
    if (scriptOnPage) {
      this._assignScriptLoadingPromise(scriptOnPage);
      return this._scriptLoadingPromise;
    }

    const script = this._documentRef.nativeDocument().createElement('script');
    script.type = 'text/javascript';
    script.async = true;
    script.defer = true;
    script.id = this._SCRIPT_ID;
    script.src = this._getScriptSrc(this.callbackName);
    this._assignScriptLoadingPromise(script);
    this._documentRef.nativeDocument().body.appendChild(script);
    return this._scriptLoadingPromise;
  }

  private _assignScriptLoadingPromise(scriptElem: HTMLElement) {
    this._scriptLoadingPromise = new Promise((resolve, reject) => {
      this._windowRef.nativeWindow()[this.callbackName] = () => {
        resolve(true);
      };

      scriptElem.onerror = (error: any) => {
        reject(error);
      };
    });
  }

  protected _getScriptSrc(callbackName: string): string {
    const hostAndPath: string = 'maps.googleapis.com/maps/api/js';
    const queryParams: { [key: string]: string | string[] } = {
      v: 'quarterly',
      callback: callbackName,
      key: this.config.googleApiKey,
      //client: this._config.clientId,
      //channel: this._config.channel,
      //libraries: this._config.libraries,
      //region: this._config.region,
      language: 'en-US',
    };
    const params: string = Object.keys(queryParams)
      .filter((k: string) => queryParams[k] != null)
      .filter((k: string) => {
        // remove empty arrays
        return (
          !Array.isArray(queryParams[k]) ||
          (Array.isArray(queryParams[k]) && queryParams[k].length > 0)
        );
      })
      .map((k: string) => {
        // join arrays as comma seperated strings
        const i = queryParams[k];
        if (Array.isArray(i)) {
          return { key: k, value: i.join(',') };
        }
        return { key: k, value: queryParams[k] };
      })
      .map((entry: { key: string; value: string | string[] }) => {
        return `${entry.key}=${entry.value}`;
      })
      .join('&');
    return `https://${hostAndPath}?${params}`;
  }
}
