import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AlphaComService {

  /**
   * return true if the string is null or empty
   * @param str the string to evaluate
   */
  static eon(str: string | undefined): boolean {
    return (!str || str.trim() === '');
  }

  static isNull(val: any): boolean {
    return (val == null);
  }

  static toNumberOrNull(val: string | undefined): number | null {
    return this.eon(val) ? null : Number(val);
  }

  /**
   * returns true if the string to find is found in the string to evaluate
   * @param strToCheck the string to evaluate
   * @param stringToFind the string to find within the string to evaluate
   * @note this method is case sensitive
   */
  static contains(strToCheck: string, stringToFind: string): boolean {
    return strToCheck.indexOf(stringToFind) >= 0;
  }

  static compareYmdDates(d1: Date, d2: Date): number  {
    const d1Ms = new Date(
      d1.getFullYear(), d1.getMonth(), d1.getDate())
      .getTime();
    const d2Ms = new Date(
      d2.getFullYear(), d2.getMonth(), d2.getDate())
      .getTime();
    if (d1Ms === d2Ms) {
      return 0;
    } else {
      return d1Ms < d2Ms ? -1 : 1;
    }

  }

  static toLocaleCurrency(
    value: number,
    locale?: string,
    nbDigits?: number,
    currency?: string) {
    if (nbDigits === undefined) {
      nbDigits = 2;
    }
    if (currency === undefined) {
      currency = "EUR";
    }

    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat/NumberFormat
    return value.toLocaleString(
      locale, {
        style: "currency",
        currencyDisplay: 'symbol',
        currency: currency,
        minimumFractionDigits: nbDigits,
        maximumFractionDigits: nbDigits
      });
  }

  static round(value: number, precision?: number) {
    if (precision === undefined) {
      precision = 0;
    }
    const str = value.toFixed(precision);
    return Number(str);
  }

  static dataUrlToBlob(dataUrl: string, sliceSize?: number): Blob {
    const scPos = dataUrl.indexOf(';')
    const contentType = dataUrl.substr(5, scPos-5);
    const header = `data:${contentType};base64,`;
    const b64 = dataUrl.substr(header.length);
    return this.b64ToBlob(b64, contentType, sliceSize);
  }

  static dataUrlToUint8Array(dataUrl: string, sliceSize?: number): Uint8Array{
    const scPos = dataUrl.indexOf(';')
    const contentType = dataUrl.substr(5, scPos-5);
    const header = `data:${contentType};base64,`;
    const b64 = dataUrl.substr(header.length);
    return this.b64ToUint8Array(b64, sliceSize);
  }

  static b64ToUint8Array(b64Data: string, sliceSize?: number): Uint8Array {
    const byteCharacters = atob(b64Data);
    if (sliceSize === undefined) {
      sliceSize = 512;
    }
    let bytes: any[] = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const len = slice.length;
      const byteNumbers = new Array(len);
      for (let i = 0; i < len; i++) {
        byteNumbers[i] =  slice.charCodeAt(i);
      }
      bytes = bytes.concat(byteNumbers)
    }
    return new Uint8Array(bytes);
  }

  static b64ToBlob(b64Data: string, contentType?: string, sliceSize?: number): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    if (sliceSize === undefined) {
      sliceSize = 512;
    }
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);
      const len = slice.length;
      const byteNumbers = new Array(len);
      for (let i = 0; i < len; i++) {
        byteNumbers[i] =  slice.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

  static getBlobUrl(b64Data: string, contentType?: string, sliceSize?: number): string {
    const blob = this.b64ToBlob(b64Data, contentType, sliceSize);
    return URL.createObjectURL(blob);
  }

}
