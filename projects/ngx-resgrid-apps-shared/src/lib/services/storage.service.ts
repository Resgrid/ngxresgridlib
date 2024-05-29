import { Inject, Injectable } from '@angular/core';
import { ResgridConfig } from '../resgrid-config';
import { LoggerService } from './logger.service';
import { IStorageProvider } from '../models/storageProvider';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(@Inject('RG_STORAGE_PROVIDER') private storageProvider: IStorageProvider, private logger: LoggerService, private config: ResgridConfig) {}

  async read(key: string): Promise<string | null> {
    if (this.storageProvider) {
      return await this.storageProvider.read(key);
    } 

    const combinedKey = `${this.config.clientId}.${key}`;
    const storedValue = localStorage.getItem(combinedKey);

    if (storedValue) {
      this.logger.logDebug(
        `readKey ${combinedKey} length: ${storedValue.length}`
      );

      return storedValue;
    }

    this.logger.logDebug(
      `readKey ${combinedKey} empty`
    );

    return null;
  }

  async write(key: string, value: string): Promise<void> {
    if (this.storageProvider) {
      return await this.storageProvider.write(key, value);
    }

    localStorage.setItem(`${this.config.clientId}.${key}`, value);
  }

  async remove(key: string): Promise<void> {
    if (this.storageProvider) {
      return await this.storageProvider.remove(key);
    }

    localStorage.removeItem(`${this.config.clientId}.${key}`);
  }

  async clear(): Promise<void> {
    if (this.storageProvider) {
      return await this.storageProvider.clear();
    }

    localStorage.clear();
  }
}
