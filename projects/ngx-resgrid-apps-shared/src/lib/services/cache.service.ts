import {
  HttpContext,
  HttpContextToken,
  HttpResponse,
} from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { ICacheable } from '../models/cacheable';
import { ICacheProvider } from '../models/cacheProvider';
import { WebCacheProvider } from '../providers/webcache.provider';

export const CACHE = new HttpContextToken<boolean>(() => false);
export const CACHE_KEY = new HttpContextToken<string>(() => '');
export const CACHE_TYPE = new HttpContextToken<number>(() => 0);
export const CACHE_TIME = new HttpContextToken<number>(() => 0);

@Injectable({
  providedIn: 'root',
})
export class CacheService {

  constructor(@Inject('RG_CACHE_PROVIDER') private cacheProvider: ICacheProvider) {}

  public setCacheInfoHttpContext(type: ICacheable): HttpContext {
    let httpContext = new HttpContext();
    httpContext.set(CACHE, true);
    httpContext.set(CACHE_KEY, type.cacheKey);
    httpContext.set(CACHE_TYPE, type.cacheType);
    httpContext.set(CACHE_TIME, type.cacheTime);

    return httpContext;
  }

  public async put(data: ICacheable): Promise<void> {
    if (this.cacheProvider) {
      data.cacheSavedOn = new Date();
      const expiresOn = new Date();
      expiresOn.setMinutes(expiresOn.getMinutes() + data.cacheTime);

      await this.cacheProvider.put(
        data.cacheKey,
        expiresOn,
        JSON.stringify(data)
      );
    }
  }

  public async get<T extends ICacheable>(key: string): Promise<T> {
    if (this.cacheProvider) {

      try {
        const data = await this.cacheProvider.get(key);

        if (data) {
          const result = JSON.parse(data) as T;

          if (result) {
            const now = new Date();

            if (result.cacheSavedOn) {
              result!.cacheSavedOn!.setMinutes(
                result!.cacheSavedOn!.getMinutes() + result.cacheTime
              );
              const diff = now.getTime() - result!.cacheSavedOn!.getTime();

              if (diff <= 0) {
                result.cacheHitFailed = true;
                await this.delete(key);
              }
            }

            return result;
          }
        }
      } catch (error) {
        return { cacheHitFailed: true } as T;
      }
    }

    return { cacheHitFailed: true } as T;
  }

  public async delete(key: string): Promise<void> {
    if (this.cacheProvider) {
      await this.cacheProvider.delete(key);
    }
  }

  public async putHttpResponse(
    cacheKey: string,
    cacheTime: number,
    response: HttpResponse<any>
  ): Promise<void> {
    if (this.cacheProvider) {
      const expiresOn = new Date();
      expiresOn.setMinutes(expiresOn.getMinutes() + cacheTime);

      await this.cacheProvider.put(
        cacheKey,
        expiresOn,
        JSON.stringify(response)
      );
    }
  }

  public async getHttpResponse(
    key: string
  ): Promise<HttpResponse<any> | undefined> {
    if (this.cacheProvider) {
      const data = await this.cacheProvider.get(key);

      if (data) {
        const result = JSON.parse(data) as HttpResponse<any>;

        return result;
      }
    }

    return undefined;
  }

  public async deleteHttpResponse(key: string): Promise<void> {
    if (this.cacheProvider) {
      await this.cacheProvider.delete(key);
    }
  }
}
