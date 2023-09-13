import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  from,
  interval,
  Observable,
  of,
  Subscription,
} from 'rxjs';
import {
  catchError,
  filter,
  flatMap,
  map,
  mergeMap,
  switchMap,
  take,
  tap,
} from 'rxjs/operators';
import { AuthStateModel } from '../../models/v4/auth/authState';
import { AuthTokenModel } from '../../models/v4/auth/authTokens';
import { LoginModel } from '../../models/v4/auth/login';
import { ProfileModel } from '../../models/v4/auth/profile';
import { ResgridConfig } from '../../resgrid-config';

import jwt_decode from 'jwt-decode';
import { UriEncoder } from '../uriEncoder.service';
import { StorageService } from '../storage.service';
import { LoggerService } from '../logger.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null,
  );

  private initalState: AuthStateModel = {
    profile: undefined,
    tokens: undefined,
    authReady: false,
  };
  private authReady$ = new BehaviorSubject<boolean>(false);
  private state: BehaviorSubject<AuthStateModel>;
  private refreshSubscription$: Subscription | undefined;

  state$: Observable<AuthStateModel>;
  tokens$: Observable<AuthTokenModel | undefined>;
  profile$: Observable<ProfileModel | undefined>;
  loggedIn$: Observable<boolean> | undefined;

  constructor(
    private http: HttpClient,
    private config: ResgridConfig,
    private storageService: StorageService,
    private logger: LoggerService,
  ) {
    this.state = new BehaviorSubject<AuthStateModel>(this.initalState);
    this.state$ = this.state.asObservable();

    this.tokens$ = this.state.pipe(
      filter(
        (state) => state.authReady != undefined && state.authReady != false,
      ),
      map((state) => state.tokens),
    );

    this.profile$ = this.state.pipe(
      filter(
        (state) => state.authReady != undefined && state.authReady != false,
      ),
      map((state) => state.profile),
    );

    this.loggedIn$ = this.tokens$.pipe(map((tokens) => !!tokens));
  }

  public init(): Observable<AuthTokenModel> {
    return this.startupTokenRefresh().pipe(tap(() => this.scheduleRefresh()));
  }

  public login(user: LoginModel): Observable<ProfileModel> {
    return this.getTokens(user, 'password');
  }

  public logout(): void {
    this.updateState({ profile: undefined, tokens: undefined });
    if (this.refreshSubscription$) {
      this.refreshSubscription$.unsubscribe();
    }
    this.removeToken();
  }

  public refreshTokens(): Observable<ProfileModel | null> {
    this.logger.logDebug(this.config.clientId, 'Starting refresh token flow');

    const storedTokens = this.retrieveTokens();

    if (
      storedTokens &&
      storedTokens.refresh_token &&
      storedTokens.refresh_token.length > 0
    ) {
      if (!this.isRefreshing) {
        this.isRefreshing = true;

        this.logger.logDebug(this.config.clientId, 'Retrived stored tokens');

        return this.getTokens(
          {
            username: '',
            password: '',
            refresh_token: storedTokens.refresh_token,
          },
          'refresh_token',
        );
      } else {
        return this.refreshTokenSubject.pipe(
          filter((profile) => profile !== null),
          take(1),
          switchMap((profile) => of(profile)),
        );
      }
    }

    this.logger.logDebug(this.config.clientId, 'No stored tokens retrived');
    return of(null);
  }

  private storeToken(tokens: AuthTokenModel): void {
    const previousTokens = this.retrieveTokens();
    if (previousTokens != null && tokens.refresh_token == null) {
      tokens.refresh_token = previousTokens.refresh_token;
    }

    this.storageService.write('auth-tokens', tokens);
  }

  public retrieveTokens(): AuthTokenModel {
    var tokens = this.storageService.read('auth-tokens');

    return tokens as AuthTokenModel;
  }

  private removeToken(): void {
    this.storageService.remove('auth-tokens');
  }

  private updateState(newState: AuthStateModel): void {
    const previousState = this.state.getValue();
    this.state.next(Object.assign({}, previousState, newState));
  }

  private getTokens(
    data: LoginModel,
    grantType: string,
  ): Observable<ProfileModel> {
    let headers: HttpHeaders = new HttpHeaders();
    headers = headers.set('Content-Type', 'application/x-www-form-urlencoded');

    let params = new HttpParams({
      encoder: new UriEncoder(),
    });

    params = params.set('grant_type', grantType);
    // params = params.append('scope', 'openid profile email dataEventRecords offline_access');

    if (this.config.isMobileApp) {
      params = params.append('scope', 'openid profile offline_access mobile');
    } else {
      params = params.append('scope', 'openid profile offline_access');
    }

    if (data.refresh_token && data.refresh_token.length > 0) {
      params = params.append('refresh_token', data.refresh_token);
    } else {
      params = params.append('username', data.username);
      params = params.append('password', data.password);
    }

    this.logger.logDebug(this.config.clientId, 'performing token connection');

    return this.http
      .post<AuthTokenModel>(`${this.config.apiUrl}/connect/token`, params, {
        headers,
      })
      .pipe(
        map((res) => {
          const now = new Date();
          res.expiration_date = new Date(now.getTime() + res.expires_in * 1000)
            .getTime()
            .toString();

          this.logger.logDebug(
            this.config.clientId,
            `got token expiration: ${res.expiration_date}`,
          );

          const profile: ProfileModel = jwt_decode(res.id_token);

          this.storeToken(res);
          this.updateState({ authReady: true, tokens: res, profile });

          this.refreshTokenSubject.next(profile);
          this.isRefreshing = false;

          return profile;
        }),
      );
  }

  private startupTokenRefresh(): Observable<AuthTokenModel> {
    return of(this.retrieveTokens()).pipe(
      map((tokens: AuthTokenModel) => {
        if (!tokens) {
          this.updateState({ authReady: true });
          return of('No token in Storage');
        }
        const profile: ProfileModel = jwt_decode(tokens.id_token);
        this.updateState({ tokens, profile });

        if (+tokens.expiration_date > new Date().getTime()) {
          this.updateState({ authReady: true });
        }

        return this.refreshTokens();
      }),
      catchError((error: any) => {
        this.logout();
        this.updateState({ authReady: true });
        return of(error);
      }),
    );
  }

  private scheduleRefresh(): void {
    this.refreshSubscription$ = this.tokens$
      .pipe(
        take(1),
        // refresh every half the total expiration time
        map((tokens: AuthTokenModel | undefined) => {
          if (tokens) {
            this.logger.logDebug(
              this.config.clientId,
              `Will refresh auth token in ${tokens.expires_in * 0.8 * 1000}`,
            );
            interval(tokens.expires_in * 0.8 * 1000);
          }
        }),
        map(() => this.refreshTokens()),
      )
      .subscribe();
  }
}
