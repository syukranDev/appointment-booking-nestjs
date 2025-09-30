import * as moment from 'moment-timezone';

export class TimezoneUtil {
  static getTimezoneFromHeader(headers: any): string {
    return headers['x-timezone'] || 'UTC';
  }

  static convertToTimezone(date: Date, timezone: string): Date {
    return moment.tz(date, timezone).toDate();
  }

  static formatDateForTimezone(date: Date, timezone: string): string {
    return moment.tz(date, timezone).format('YYYY-MM-DD HH:mm:ss');
  }

  static getCurrentTimeInTimezone(timezone: string): Date {
    return moment.tz(timezone).toDate();
  }

  static isBusinessHours(date: Date, timezone: string): boolean {
    const momentDate = moment.tz(date, timezone);
    const hour = momentDate.hour();
    const day = momentDate.day(); 
    
    // notedev: 9 - 5pm
    return day >= 1 && day <= 5 && hour >= 9 && hour < 17;
  }
}
