// from https://github.com/paritosh64ce/ngx-pub-sub/blob/master/libs/ngx-pub-sub/src/lib/types/subject-type.enum.ts

import { Injectable, OnDestroy } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  ReplaySubject,
  SchedulerLike,
  Subject,
  Subscription,
} from 'rxjs';

export interface IHash {
  [key: string]: {
    type: SubjectType;
    ref: Subject<any> | BehaviorSubject<any> | ReplaySubject<any>;
  };
}

export enum SubjectType {
  Subject,
  BehaviorSubject,
  ReplaySubject,
}

@Injectable({
  providedIn: 'root',
})
export class PubSubService implements OnDestroy {
  private eventObservableMapping: IHash;

  constructor() {
    this.eventObservableMapping = {};
  }

  publishEvent(eventName: string, data?: any) {
    this.validateEventName(eventName);
    this.createSubjectIfNotExist(eventName);

    this.publishNext(eventName, SubjectType.Subject, data);
  }

  subscribe(
    eventName: string,
    next?: (value: any) => void,
    error?: (error: any) => any,
    complete?: () => void,
  ): Subscription {
    this.validateEventName(eventName);
    // subject will be created if the provided eventName is not registered
    this.createSubjectIfNotExist(eventName);

    return this.eventObservableMapping[eventName].ref.subscribe(
      next,
      error,
      complete,
    );
  }

  /**
   * Use this method to get the Observable associated with the event.
   * Useful when you would like to apply additional rxjs operators like debounceTime
   */
  getEventObservable(eventName: string): Observable<any> {
    this.validateEventName(eventName);
    // subject will be created if the provided eventName is not registered
    this.createSubjectIfNotExist(eventName);

    return this.eventObservableMapping[eventName].ref.asObservable();
  }

  registerEventWithLast(name: string, defaultValue: any) {
    this.validateEventName(name);
    // type and name check
    this.checkType(name, SubjectType.BehaviorSubject, true);
    // create one
    this.eventObservableMapping[name] = {
      type: SubjectType.BehaviorSubject,
      ref: new BehaviorSubject(defaultValue),
    };
  }

  registerEventWithHistory(
    name: string,
    bufferSize?: number,
    windowTime?: number,
    scheduler?: SchedulerLike,
  ) {
    this.validateEventName(name);
    // type and name check
    this.checkType(name, SubjectType.ReplaySubject, true);
    // create one
    this.eventObservableMapping[name] = {
      type: SubjectType.ReplaySubject,
      ref: new ReplaySubject(bufferSize, windowTime, scheduler),
    };
  }

  publishWithLast(eventName: string, data?: any) {
    this.validateEventName(eventName);
    this.publishNext(eventName, SubjectType.BehaviorSubject, data);
  }

  publishWithHistory(eventName: string, data?: any) {
    this.validateEventName(eventName);
    this.publishNext(eventName, SubjectType.ReplaySubject, data);
  }

  completeEvent(eventName: string) {
    this.validateEventName(eventName);
    if (!this.eventObservableMapping[eventName]) {
      throw Error('Event not created yet');
    }
    this.completeObservableAndDestroyMapping(eventName);
  }

  ngOnDestroy() {
    for (const eventName in this.eventObservableMapping) {
      if (this.eventObservableMapping.hasOwnProperty(eventName)) {
        this.completeObservableAndDestroyMapping(eventName);
      }
    }
  }

  private publishNext(
    eventName: string,
    type: SubjectType = SubjectType.Subject,
    data?: any,
  ) {
    this.checkType(eventName, type);
    this.eventObservableMapping[eventName].ref.next(data);
  }

  private checkType(
    eventName: string,
    type: SubjectType = SubjectType.Subject,
    shouldNotExist = false,
  ) {
    const object = this.eventObservableMapping[eventName];
    let errorMessage;
    if (!object && shouldNotExist) {
      return;
    }
    if (!object) {
      errorMessage = `Event doesn't exist of type: ${SubjectType[type]} or it has been completed`;
    } else if (object.type !== type) {
      errorMessage = `Event exists with other type: ${
        SubjectType[object.type]
      }. Expected type: ${SubjectType[type]}`;
    }
    if (shouldNotExist && object.type === type) {
      errorMessage = `Event already registerd with the same type. Don't register a second time`;
    }
    if (errorMessage) {
      throw Error(`Error (${eventName}): ${errorMessage}`);
    }
  }

  private createSubjectIfNotExist(eventName: string) {
    const object = this.eventObservableMapping[eventName];
    if (object) {
      return;
    }

    this.eventObservableMapping[eventName] = {
      type: SubjectType.Subject,
      ref: new Subject(),
    };
  }

  private validateEventName(eventName: string) {
    if (!eventName) {
      throw Error('Event name not provided');
    }
  }

  private completeObservableAndDestroyMapping(eventName: string) {
    this.eventObservableMapping[eventName].ref.complete();
    delete this.eventObservableMapping[eventName];
  }
}
