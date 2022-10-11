import { Injectable, NgModule } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { AuthService } from '../services/v4/auth.service';
import { ResgridConfig } from '../resgrid-config';
import {
  catchError,
  concatMap,
  delay,
  filter,
  retryWhen,
  switchMap,
  take,
} from 'rxjs/operators';
import { LoggerService } from '../services/logger.service';

export const retryCount = 3;

@Injectable({
  providedIn: 'root'
})
export class HttpsRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  constructor(
    private authService: AuthService,
    private config: ResgridConfig,
    private logger: LoggerService
  ) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (this.shouldAddTokenToRequest(req.url)) {
      const dupReq = this.addAuthHeader(req);

      return next.handle(dupReq).pipe(
        catchError((error) => {
          if (error instanceof HttpErrorResponse && error.status === 401) {
            return this.handle401Error(req, next);
          }

          return throwError(error);
        })
      );
    }
    return next.handle(req);
  }

  private handle401Error(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.authService.refreshTokens().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;

          const dupReq = this.addAuthHeader(req);
          const tokens = this.authService.retrieveTokens();
          this.refreshTokenSubject.next(tokens.access_token);

          return next.handle(dupReq);
        }),
        catchError((err) => {
          this.isRefreshing = false;

          this.authService.logout();
          return throwError(err);
        })
      );
    }

    return this.refreshTokenSubject.pipe(
      filter(token => token !== null),
      take(1),
      switchMap((token) => next.handle(this.addAuthHeader(req)))
    );
  }

  private addAuthHeader(request: HttpRequest<any>): HttpRequest<any> {
    const tokens = this.authService.retrieveTokens();
    if (tokens) {
      const dupReq = request.clone({
        headers: request.headers.set(
          'Authorization',
          'Bearer ' + tokens.access_token
        ),
      });

      return dupReq;
    }

    return request;
  }

  private handleResponseError(
    error: HttpErrorResponse,
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (error.status === 400) {
      // Show message
    }

    // Unauthorized
    else if (error.status === 401) {
      this.logger.logDebug(
        this.config.clientId,
        `In handleResponseError got 401 response: ${request.url}`
      );

      return timer(10000).pipe(
        switchMap(() => {
          const dupReq = this.addAuthHeader(request);

          return next.handle(dupReq); //.pipe(delay(1500));
        })
      );
    }

    // Access denied error
    else if (error.status === 403) {
      // Show message
      // Logout
      //this.logout();
    }

    // Server error
    else if (error.status === 500) {
      // Show message
    }

    // Maintenance error
    else if (error.status === 503) {
      // Show message
      // Redirect to the maintenance page
    }

    return throwError(error);
  }

  private shouldAddTokenToRequest(requestUrl: string): boolean {
    if (!requestUrl.startsWith(this.config.baseApiUrl())) {
      return false;
    }

    if (requestUrl.includes('/connect/token')) {
      return false;
    }

    return true;
  }
}