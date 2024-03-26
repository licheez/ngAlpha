import * as dayjs from "dayjs";

export class AlphaYmd {

  constructor(private mDate: Date) { }

  /**
   * Parses a string representing a date in the format
   * "yyyy-MM-dd" and returns a Date object.
   *
   * @param {string} ymd - The string representing the date in "yyyy-MM-dd" format.
   * @return {Date} The parsed Date object.
   */
  static parse(ymd: string): Date {
    return new Date(ymd)
  }

  /**
   * Converts the date stored in the object to a string representation
   * in the format 'YYYY-MM-DD'.
   *
   * @return {string} The string representation of the date.
   */
  stringify(): string {
    return AlphaYmd.format(
      this.mDate, 'YYYY-MM-DD');
  }
  static stringify(date: Date): string {
    return this.format(date, 'YYYY-MM-DD');
  }

  /**
   * Formats the date using the specified format.
   *
   * @param {string} [format] - The format to use for formatting the date.
   * If not provided, a default format will be used.
   * Default is 'DD/MM/YYYY'.
   * @return {string} The formatted date string.
   */
  format(format?: string): string {
    return AlphaYmd.format(this.mDate, format);
  }

  /**
   * Formats a date using a specified format.
   * If no format is provided, the default format is 'DD/MM/YYYY'.
   *
   * @param {Date} date - The date to format.
   * @param {string} [format] - The format to use. Default is 'DD/MM/YYYY'.
   * @return {string} The formatted date as a string.
   */
  static format(date: Date, format?: string): string {
    if (!format) {
      format = 'DD/MM/YYYY';
    }
    const m = dayjs(date);
    return m.format(format);
  }

  /**
   * Formats the range of dates.
   *
   * @param {Date} startDate - The start date of the range.
   * @param {Date} endDate - The end date of the range.
   * @param {string} [format] - The format of the dates. (Optional)
   * @param {string} [separator] - The separator between the dates. (Optional)
   * @return {string} The formatted range of dates.
   */
  static formatRange(startDate: Date, endDate: Date,
                     format?: string, separator?: string): string {
    if (!separator) {
      separator = '-';
    }
    const sDate = AlphaYmd.format(startDate, format);
    const eDate = AlphaYmd.format(endDate, format);
    return `${sDate}${separator}${eDate}`;
  }

  /**
   * Converts the given date to a string in the format "YYYY-MM-DD".
   *
   * @param {Date} date - The date to be converted.
   * @returns {Date} - The converted date in the format "YYYY-MM-DD".
   */
  static toYmd(date: Date): Date {
    return this.parse(this.stringify(date));
  }

  /**
   * Checks if a given date is within a range of minimum and maximum dates.
   *
   * @param {Date} date - The date to check.
   * @param {Date} minDate - The minimum date of the range.
   * @param {Date} maxDate - The maximum date of the range.
   * @returns {boolean} - True if the date is within the range, false otherwise.
   */
  static inYmdRange(date: Date, minDate: Date, maxDate: Date): boolean {
    const ymdDte = this.toYmd(date);
    const ymdMin = this.toYmd(minDate);
    const ymdMax = this.toYmd(maxDate);
    const dteTs = ymdDte.getTime();
    const minTs = ymdMin.getTime();
    const maxTs = ymdMax.getTime();
    return dteTs >= minTs && dteTs <= maxTs;
  }

  /**
   * Checks if two dates have the same year, month, and day.
   *
   * @param {Date} dt0 - The first date.
   * @param {Date} dt1 - The second date.
   * @return {boolean} Returns true if the two dates have the same year,
   * month, and day; otherwise, returns false.
   */
  static ymdEqual(dt0: Date, dt1: Date): boolean {
    return this.ymdCompare(dt0, dt1) === 0;
  }

  /**
   * Compares two dates and returns the comparison result.
   *
   * @param {Date} dt0 - The first date to compare.
   * @param {Date} dt1 - The second date to compare.
   * @returns {number} - Returns 0 if the dates are equal, -1 if dt0 < dt1, and 1 if dt0 > dt1.
   */
  static ymdCompare(dt0: Date, dt1: Date): number {
    const ymdDt0 = this.toYmd(dt0);
    const ymdDt1 = this.toYmd(dt1);
    const dt0Ts = ymdDt0.getTime();
    const dt1Ts = ymdDt1.getTime();
    return dt0Ts === dt1Ts ? 0 : (dt0Ts < dt1Ts ? -1 :  1);
  }

}
