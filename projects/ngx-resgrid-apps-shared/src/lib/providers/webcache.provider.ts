import { Injectable } from '@angular/core';
import { ICacheProvider } from '../models/cacheProvider';
import { WebCacheWrapper } from '../models/webCacheWrapper';
import { StorageService } from '../services/storage.service';

@Injectable({
    providedIn: 'root'
  })
export class WebCacheProvider implements ICacheProvider {
  constructor() {}

  public initialize(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
        resolve();
      });
  }

  public get(key: string): Promise<string> {
    const that = this;

    return new Promise<string>((resolve, reject) => {
      const cacheItem = that.localStorageRead(key) as WebCacheWrapper;
      const cacheDate = new Date(cacheItem.expiresOn);
      const now = new Date();

      if (cacheItem) {
        if (cacheDate > now) {
          resolve(cacheItem.data);
        } else {
          that.localStorageRemove(key);
          reject();
        }
      } else {
        reject();
      }
    });
  }

  public put(key: string, expiresOn: Date, data: string): Promise<void> {
    const that = this;

    return new Promise<void>((resolve, reject) => {
      const cacheItem = new WebCacheWrapper();
      cacheItem.expiresOn = expiresOn;
      cacheItem.data = data;

      that.localStorageWrite(key, cacheItem);
      resolve();
    });
  }

  public delete(key: string): Promise<void> {
    const that = this;

    return new Promise<void>((resolve, reject) => {
      that.localStorageRemove(key);
      resolve();
    });
  }

  private localStorageRead(key: string): any {
    const combinedKey = `RGC.${key}`;
    const storedValue = localStorage.getItem(combinedKey);

    if (storedValue) {
      return JSON.parse(storedValue);
    }

    return null;
  }

  private localStorageWrite(key: string, value: any): boolean {
    localStorage.setItem(`RGC.${key}`, JSON.stringify(value));

    return true;
  }

  private localStorageRemove(key: string): boolean {
    localStorage.removeItem(`RGC.${key}`);

    return true;
  }
}
