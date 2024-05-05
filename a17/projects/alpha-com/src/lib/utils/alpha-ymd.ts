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
    return new Date(ymd);
  }

  stringify(): string {
    return AlphaYmd.format(
      this.mDate, 'YMD', 'Dash');
  }
  /**
   * Takes a Date object and returns a formatted string representation of the date.
   *
   * @param {Date} date - The date to be converted to string.
   * @return {string} - The formatted string representation of the date.
   */
  static stringify(date: Date): string {
    return this.format(date, 'YMD', 'Dash');
  }

  /**
   * Formats the date in the specified format and separator.
   *
   * @param {string} format - The format of the date. It can be 'YMD', 'DMY', 'MDY' or 'DM.
   * @param {string} sep - The separator to use. It can be 'Slash' or 'Dash'.
   * @returns {string} The formatted date.
   */
  format(format?: 'YMD' | 'DMY' | 'MDY' | 'DM',
         sep?: 'Slash' | 'Dash'): string {
    return AlphaYmd.format(this.mDate, format, sep);
  }

  /**
   * Formats a date into a string based on the given format and separator.
   *
   * @param {Date} date - The date object to be formatted.
   * @param {string} [format='DMY'] - The format of the date string. Possible values are 'YMD', 'DMY', 'MDY' or 'DM'.
   * @param {string} [sep='Slash'] - The separator to be used in the date string. Possible values are 'Slash' and 'Dash'.
   * @returns {string} The formatted date string.
   */
  static format(date: Date,
                format?: 'YMD' | 'DMY' | 'MDY' | 'DM',
                sep?: 'Slash' | 'Dash'): string {
    if (!format) {
      format = 'DMY';
    }
    if (!sep) {
      sep = 'Slash';
    }

    const d = date.getDate();
    const dd = d < 10 ? `0${d}`: `${d}`;
    const m = date.getMonth() + 1;
    const mm = m < 10 ? `0${m}`: `${m}`;
    const yyyy =  date.getFullYear();
    const s = sep === 'Slash' ? '/' : '-';

    switch (format) {
      case 'YMD':
        return `${yyyy}${s}${mm}${s}${dd}`;
      case 'DMY':
        return `${dd}${s}${mm}${s}${yyyy}`;
      case 'MDY':
        return `${mm}${s}${dd}${s}${yyyy}`;
      case 'DM':
        return `${dd}${s}${mm}`;
    }
  }

  /**
   * Formats the range of two dates into a string.
   *
   * @param {Date} startDate - The start date of the range.
   * @param {Date} endDate - The end date of the range.
   * @param {string} [rangeSep] - The separator to use between the formatted dates. Default is '-'.
   * @param {('YMD' | 'DMY' | 'MDY' | 'DM')} [format] - The format to use for the date. Default is 'YMD'.
   * @param {('Slash' | 'Dash')} [sep] - The separator to use within the formatted date. Default is 'Slash'.
   *
   * @returns {string} - The formatted range string.
   */
  static formatRange(startDate: Date, endDate: Date,
                     rangeSep?: string,
                     format?: 'YMD' | 'DMY' | 'MDY' | 'DM',
                     sep?: 'Slash' | 'Dash'): string {
    const sDate = AlphaYmd.format(startDate, format, sep);
    const eDate = AlphaYmd.format(endDate, format, sep);
    if (!rangeSep) {
      rangeSep = '-';
    }
    return `${sDate}${rangeSep}${eDate}`;
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
