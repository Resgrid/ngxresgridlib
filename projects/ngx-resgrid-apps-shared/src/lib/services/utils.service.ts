import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  private monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
  ];

  private monthShortNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
  ];

  public to2Digit(str: string): string {
    if (!str) {
      return '';
    }

    const isString: boolean = typeof str === 'string';
    if (isString && str.length === 1) {
      str = 0 + str;
    }
    return str;
  }

  public getMinutesBetweenDates(startDate: Date, endDate: Date): number {
    let diff = endDate.getTime() - startDate.getTime();
    return diff / 60000;
  }

  public parseDateISOString(s: string): Date {
    const b = s.split(/\D/);
    return new Date(
      parseInt(b[0], 10),
      parseInt(b[1], 10) - 1,
      parseInt(b[2], 10),
      parseInt(b[3], 10),
      parseInt(b[4], 10),
      parseInt(b[5], 10)
    );
  }

  public getDate(date: string): string {
    if (!date) {
      return 'Unknown';
    }

    const d = new Date(date);
    const datestring =
      ('0' + d.getDate()).slice(-2) +
      '-' +
      ('0' + (d.getMonth() + 1)).slice(-2) +
      '-' +
      d.getFullYear() +
      ' ' +
      ('0' + d.getHours()).slice(-2) +
      ':' +
      ('0' + d.getMinutes()).slice(-2);

    return datestring;
  }

  public formatDateForDisplay(date: Date, format: string): string {
    // Original idea from: https://weblog.west-wind.com/posts/2008/Mar/18/A-simple-formatDate-function-for-JavaScript

    if (!date) {
      return '';
    }

    if (!format) {
      format = 'MM/dd/yyyy';
    }

    const month = date.getMonth() + 1;
    const year = date.getFullYear();

    if (format.indexOf('MMMM') > -1) {
      format = format.replace('MMMM', this.monthNames[date.getMonth()]);
    } else if (format.indexOf('MMM') > -1) {
      format = format.replace('MMM', this.monthShortNames[date.getMonth()]);
    } else if (format.indexOf('MM') > -1) {
      format = format.replace('MM', this.padLeadingZero(month).toString());
    }

    if (format.indexOf('yyyy') > -1) {
      format = format.replace('yyyy', year.toString());
    } else if (format.indexOf('yy') > -1) {
      format = format.replace('yy', year.toString().substr(2, 2));
    }

    format = format.replace(
      'dd',
      this.padLeadingZero(date.getDate()).toString()
    );

    let hours = date.getHours();
    if (format.indexOf('t') > -1) {
      if (hours > 11) {
        format = format.replace('t', 'pm');
      } else {
        format = format.replace('t', 'am');
      }
    }
    if (format.indexOf('HH') > -1) {
      format = format.replace('HH', this.padLeadingZero(hours).toString());
    }

    if (format.indexOf('hh') > -1) {
      if (hours > 12) {
        hours = hours - 12;
      }

      if (hours === 0) {
        hours = hours = 12;
      }
      format = format.replace('hh', this.padLeadingZero(hours).toString());
    }
    if (format.indexOf('mm') > -1) {
      format = format.replace(
        'mm',
        this.padLeadingZero(date.getMinutes()).toString()
      );
    }

    if (format.indexOf('ss') > -1) {
      format = format.replace(
        'ss',
        this.padLeadingZero(date.getSeconds()).toString()
      );
    }
    if (format.indexOf('dd') > -1) {
      format = format.replace(
        'ss',
        this.padLeadingZero(date.getDay()).toString()
      );
    }
    if (format.indexOf('Z') > -1) {
      let timeZone: string | undefined;
      try {
        // Chrome, Firefox
        let zone = /.*\s(.+)/.exec(
          new Date()?.toLocaleDateString(navigator.language, {
            timeZoneName: 'short',
          })
        );
        if (zone) {
          timeZone = zone[1];
        }
      } catch (e) {
        // IE, some loss in accuracy due to guessing at the abbreviation
        // Note: This regex adds a grouping around the open paren as a
        //       workaround for an IE regex parser bug
        timeZone = new Date()
          .toTimeString()
          ?.match(new RegExp('[A-Z](?!.*[(])', 'g'))
          ?.join('');
      }

      if (timeZone) {
        format = format.replace('Z', timeZone);
      }
    }

    return format;
  }

  public formatDateString(date: Date): string {
    const day = date.getDate(); // yields date
    const month = date.getMonth() + 1; // yields month (add one as '.getMonth()' is zero indexed)
    const year = date.getFullYear(); // yields year
    const hour = date.getHours(); // yields hours
    const minute = date.getMinutes(); // yields minutes
    const second = date.getSeconds(); // yields seconds
    let timeZone = '';

    /*
        try {
            // Chrome, Firefox
            timeZone = /.*\s(.+)/.exec((new Date()).toLocaleDateString(navigator.language, { timeZoneName:'short' }))[1];
        } catch(e) {
            // IE, some loss in accuracy due to guessing at the abbreviation
            // Note: This regex adds a grouping around the open paren as a
            //       workaround for an IE regex parser bug
            timeZone = (new Date()).toTimeString().match(new RegExp('[A-Z](?!.*[\(])','g')).join('');
        }
        */

    timeZone = this.createDateUTCOffset(date);

    const time =
      this.padLeadingZero(month) +
      '/' +
      this.padLeadingZero(day) +
      '/' +
      year +
      ' ' +
      this.padLeadingZero(hour) +
      ':' +
      this.padLeadingZero(minute) +
      ':' +
      this.padLeadingZero(second) +
      ' ' +
      timeZone;

    return time;
  }

  public padLeadingZero(value: number): string {
    return value < 10 ? '0' + value : value.toString();
  }

  private createDateUTCOffset(date: Date): string {
    const sign = date.getTimezoneOffset() > 0 ? '-' : '+';
    const offset = Math.abs(date.getTimezoneOffset());
    const hours = this.padLeadingZero(Math.floor(offset / 60));
    const minutes = this.padLeadingZero(offset % 60);
    return sign + hours + ':' + minutes;
  }

  public addDaysToDate(date: string, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }

  public subtractDaysFromDate(date: string, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - days);
    return result;
  }

  public getTimeAgo(time: any): string {
    if (!time) {
      return 'Unknown';
    }

    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) {
          time = time.getTime();
        }
        break;
      default:
        time = +new Date();
    }

    const timeFormats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    let seconds = (+new Date() - time) / 1000,
      token = 'ago',
      listChoice = 1;

    if (seconds === 0) {
      return 'Just now';
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      listChoice = 2;
    }
    let i = 0,
      format;
    while ((format = timeFormats[i++])) {
      if (seconds < format[0]) {
        if (typeof format[2] === 'string') {
          return format[listChoice].toString();
        } else {
          return (
            Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token
          );
        }
      }
    }
    return time;
  }

  public getTimeAgoUtc(time: any): string {
    if (!time) {
      return 'Unknown';
    }

    switch (typeof time) {
      case 'number':
        break;
      case 'string':
        time = +new Date(time);
        break;
      case 'object':
        if (time.constructor === Date) {
          time = time.getTime();
        }
        break;
      default:
        time = +new Date();
    }

    const currentDate = new Date();
    time = Number(new Date(time).getTime() + 0 * 60 * 1000);

    const timeFormats = [
      [60, 'seconds', 1], // 60
      [120, '1 minute ago', '1 minute from now'], // 60*2
      [3600, 'minutes', 60], // 60*60, 60
      [7200, '1 hour ago', '1 hour from now'], // 60*60*2
      [86400, 'hours', 3600], // 60*60*24, 60*60
      [172800, 'Yesterday', 'Tomorrow'], // 60*60*24*2
      [604800, 'days', 86400], // 60*60*24*7, 60*60*24
      [1209600, 'Last week', 'Next week'], // 60*60*24*7*4*2
      [2419200, 'weeks', 604800], // 60*60*24*7*4, 60*60*24*7
      [4838400, 'Last month', 'Next month'], // 60*60*24*7*4*2
      [29030400, 'months', 2419200], // 60*60*24*7*4*12, 60*60*24*7*4
      [58060800, 'Last year', 'Next year'], // 60*60*24*7*4*12*2
      [2903040000, 'years', 29030400], // 60*60*24*7*4*12*100, 60*60*24*7*4*12
      [5806080000, 'Last century', 'Next century'], // 60*60*24*7*4*12*100*2
      [58060800000, 'centuries', 2903040000], // 60*60*24*7*4*12*100*20, 60*60*24*7*4*12*100
    ];
    let seconds =
        (Number(
          new Date(currentDate).getTime() +
            new Date(currentDate).getTimezoneOffset() * 60 * 1000
        ) -
          time) /
        1000,
      token = 'ago',
      listChoice = 1;

    if (seconds === 0) {
      return 'Just now';
    }
    if (seconds < 0) {
      seconds = Math.abs(seconds);
      token = 'from now';
      listChoice = 2;
    }
    let i = 0,
      format;
    while ((format = timeFormats[i++])) {
      if (seconds < format[0]) {
        if (typeof format[2] === 'string') {
          return format[listChoice].toString();
        } else {
          return (
            Math.floor(seconds / format[2]) + ' ' + format[1] + ' ' + token
          );
        }
      }
    }
    return time;
  }

  public generateUUID(): string {
    var d = new Date().getTime(); //Timestamp

    // Time in microseconds since page-load or 0 if unsupported
    var d2 =
      (typeof performance !== 'undefined' &&
        performance.now &&
        performance.now() * 1000) ||
      0;
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = Math.random() * 16; //random number between 0 and 16
        if (d > 0) {
          //Use timestamp until depleted
          r = (d + r) % 16 | 0;
          d = Math.floor(d / 16);
        } else {
          //Use microseconds since page-load if supported
          r = (d2 + r) % 16 | 0;
          d2 = Math.floor(d2 / 16);
        }
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      }
    );
  }

  public invertColor(hex: string, bw: boolean): string {
    if (hex.indexOf('#') === 0) {
      hex = hex.slice(1);
    }
    // convert 3-digit hex to 6-digits.
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      throw new Error('Invalid HEX color.');
    }
    let r = parseInt(hex.slice(0, 2), 16),
      g = parseInt(hex.slice(2, 4), 16),
      b = parseInt(hex.slice(4, 6), 16);
    if (bw) {
      // https://stackoverflow.com/a/3943023/112731
      return r * 0.299 + g * 0.587 + b * 0.114 > 186 ? '#000000' : '#FFFFFF';
    }
    // invert color components
    let r2 = (255 - r).toString(16),
      g2 = (255 - g).toString(16),
      b2 = (255 - b).toString(16);
    // pad each with zeros and return
    return (
      '#' + this.padZero(r2, 2) + this.padZero(g2, 2) + this.padZero(b2, 2)
    );
  }

  public padZero(str: string, len: number): string {
    len = len || 2;
    var zeros = new Array(len).join('0');
    return (zeros + str).slice(-len);
  }
}
