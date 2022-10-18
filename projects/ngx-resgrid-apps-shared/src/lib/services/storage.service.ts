import { Injectable } from '@angular/core';
import { ResgridConfig } from '../resgrid-config';
import { LoggerService } from './logger.service';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor(private logger: LoggerService, private config: ResgridConfig) {}

  read(key: string): any {
    const combinedKey = `${this.config.clientId}.${key}`;
    const storedValue = localStorage.getItem(combinedKey);

    if (storedValue) {
      this.logger.logDebug(
        `readKey ${combinedKey} length: ${storedValue.length}`
      );

      return JSON.parse(storedValue);
    }

    this.logger.logDebug(
      `readKey ${combinedKey} empty`
    );

    return null;
  }

  write(key: string, value: any): boolean {
    localStorage.setItem(
      `${this.config.clientId}.${key}`,
      JSON.stringify(value)
    );

    return true;
  }

  remove(key: string): boolean {
    localStorage.removeItem(`${this.config.clientId}.${key}`);

    return true;
  }

  clear(): boolean {
    localStorage.clear();

    return true;
  }
}
