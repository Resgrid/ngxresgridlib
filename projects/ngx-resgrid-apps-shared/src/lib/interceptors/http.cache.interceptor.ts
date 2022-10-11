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
import { from, Observable, of } from 'rxjs';
import { catchError, finalize, switchMap, tap } from 'rxjs/operators';
import {
  CACHE,
  CacheService,
  CACHE_KEY,
  CACHE_TIME,
  CACHE_TYPE,
} from '../services/cache.service';

@Injectable({
  providedIn: 'root',
})
export class CacheInterceptor implements HttpInterceptor {
  constructor(private cacheService: CacheService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    //check if the outgoing calls are GETs
    if (req.method === 'GET') {
      if (req.context.get(CACHE)) {
        if (req.context.get(CACHE_TYPE) === 1) {
          return from(this.cacheService.getHttpResponse(req.context.get(CACHE_KEY))).pipe(
            switchMap((cachedResponse) => {
              if (cachedResponse) {
                console.log(
                  `Returning a cached response: ${req.context.get(CACHE_KEY)}`
                );
                return of(cachedResponse);
              } else {
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
              }
            }),
            catchError((val) => {
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
