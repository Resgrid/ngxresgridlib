import { Injectable } from '@angular/core';
import { ResgridConfig } from '../resgrid-config';

@Injectable({
  providedIn: 'root',
})
export class LoggerService {
  public constructor(private config: ResgridConfig) {}

  logError(message: any, ...args: any[]): void {
    if (this.config.logLevel >= 2) {
      if (!!args && !!args.length) {
        console.error(`[ERROR] - ${message}`, ...args);
      } else {
        console.error(`[ERROR] - ${message}`);
      }
    }
  }

  logWarning(message: any, ...args: any[]): void {
    if (this.config.logLevel >= 1) {
      if (!!args && !!args.length) {
        console.warn(`[WARN] - ${message}`, ...args);
      } else {
        console.warn(`[WARN] - ${message}`);
      }
    }
  }

  logDebug(configId: string, message: any, ...args: any[]): void {
    if (this.config.logLevel >= 0) {
      if (!!args && !!args.length) {
        console.log(`[DEBUG] ${configId} - ${message}`, ...args);
      } else {
        console.log(`[DEBUG] ${configId} - ${message}`);
      }
    }
  }
}
