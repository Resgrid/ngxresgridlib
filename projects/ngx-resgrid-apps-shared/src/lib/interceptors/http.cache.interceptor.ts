import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpContextToken,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { switchMap, tap, catchError } from 'rxjs/operators';
import {
  CACHE,
  CacheService,
  CACHE_KEY,
  CACHE_TIME,
  CACHE_TYPE,
} from '../services/cache.service';
import { LoggerService } from '../services/logger.service';

@Injectable({
  providedIn: 'root',
})
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService, private loggerService: LoggerService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //check if the outgoing calls are GETs
    if (req.method === 'GET') {
      if (req.context.get(CACHE)) {
        if (req.context.get(CACHE_TYPE) === 1) {
          return next.handle(req).pipe(
            tap<HttpEvent<any>>((httpEvent: HttpEvent<any>) => {
              if (httpEvent instanceof HttpResponse) {
                this.cacheService.putHttpResponse(
                  req.context.get(CACHE_KEY),
                  req.context.get(CACHE_TIME),
                  httpEvent
                );
              }
            }),
            switchMap((httpEvent: HttpEvent<any>) => {
              return of(httpEvent);
            }),
            catchError((err: HttpErrorResponse) => {
              throw err;
            })
          );
        } else { // TODO: Cache Type 2
          // pass along non-cacheable requests
          return next.handle(req);
        }
      } else {
        // pass along non-cacheable requests
        return next.handle(req);
      }
    } else {
      // pass along non-cacheable requests
      return next.handle(req);
    }
  }
}
