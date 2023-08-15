import { DateTime, DurationLike } from 'luxon';

export class DateHelper {
  static addToCurrent(duration: DurationLike): Date {
    const dt = DateTime.now();
    return dt.plus(duration).toJSDate();
  }

  static isAfterCurrent(date: Date): boolean {
    const d1 = DateTime.fromJSDate(date ?? new Date());
    const d2 = DateTime.now();
    return d2 > d1;
  }

  static isValidDate(date: Date): boolean {
    // set date format to accept
    const dateFormat = 'yyyy-MM-dd';
    // check if date is valid
    return DateTime.fromFormat(date.toString(), dateFormat).isValid;
  }
}
