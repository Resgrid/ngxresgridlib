import { Injectable, NgModule } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
} from '@angular/common/http';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { BehaviorSubject, Observable, from, of, throwError, timer } from 'rxjs';
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
  providedIn: 'root',
})
export class HttpsRequestInterceptor implements HttpInterceptor {
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
      return from(this.addAuthHeader(req)).pipe(
        switchMap((dupReq: any) => {
          return next.handle(dupReq).pipe(
            catchError((error) => {
              if (error instanceof HttpErrorResponse && error.status === 401) {
                return this.handle401Error(req, next);
              }

              return throwError(() => error);
            })
          );
        })
      );
    }
    return next.handle(req);
  }

  private handle401Error(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.authService.refreshTokens().pipe(
      switchMap((response) => this.addAuthHeader(req)),
      switchMap((dupReq: any) => {
        return next.handle(dupReq);
      }),
      catchError((err) => {
        this.authService.logout().then(() => {
          this.logger.logDebug('User logged out due to 401 error');
        });
        return throwError(() => err);
      })
    );
  }

  private async addAuthHeader(
    request: HttpRequest<any>
  ): Promise<HttpRequest<any>> {
    const tokens = await this.authService.retrieveTokens();
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
