import { Injectable } from '@angular/core';
import { ResgridConfig } from '../resgrid-config';

@Injectable({
    providedIn: 'root',
  })
export class LoggerService {

  public constructor(private config: ResgridConfig){

  }

  logError(message: any, ...args: any[]): void {
    if (this.config.logLevel >= 2) {
      if (!!args && !!args.length) {
          console.error(`[ERROR] ${this.config.clientId} - ${message}`, ...args);
        } else {
          console.error(`[ERROR] ${this.config.clientId} - ${message}`);
        }
    }
  }

  logWarning(message: any, ...args: any[]): void {
    if (this.config.logLevel >= 1) {
      if (!!args && !!args.length) {
          console.warn(`[WARN] ${this.config.clientId} - ${message}`, ...args);
        } else {
          console.warn(`[WARN] ${this.config.clientId} - ${message}`);
        }
    }
  }

  logDebug(message: any, ...args: any[]): void {
    if (this.config.logLevel >= 0) {
      if (!!args && !!args.length) {
        console.log(`[DEBUG] ${this.config.clientId} - ${message}`, ...args);
      } else {
        console.log(`[DEBUG] ${this.config.clientId} - ${message}`);
      }
    }
  }
}