/**
 * AlphaNsUtils provides static utility methods for working with data URLs, base64 strings, Blobs, and binary data in web applications.
 *
 * Features:
 * - Convert data URLs to Blob and Uint8Array
 * - Convert base64 strings to Blob and Uint8Array
 * - Generate blob URLs from base64 data for previews/downloads
 *
 * All methods are pure and stateless, suitable for use in Angular services, components, and tests.
 */
export class AlphaNsUtils {
  /**
   * Converts a data URL string to a Blob object.
   *
   * @param dataUrl The data URL to convert (e.g., 'data:text/plain;base64,...').
   * @param sliceSize Optional slice size for splitting the base64 data (default: 512).
   * @returns The converted Blob object with the correct content type.
   */
  static dataUrlToBlob(dataUrl: string, sliceSize?: number): Blob {
    const scPos = dataUrl.indexOf(';')
    const contentType = dataUrl.substring(5, scPos);
    const header = `data:${contentType};base64,`;
    const b64 = dataUrl.substring(header.length);
    return this.b64ToBlob(b64, contentType, sliceSize);
  }

  /**
   * Converts a data URL to a Uint8Array.
   *
   * @param dataUrl The data URL to convert (e.g., 'data:image/png;base64,...').
   * @param sliceSize Optional slice size for dividing the base64 string into chunks.
   * @returns The converted Uint8Array representing the binary data.
   */
  static dataUrlToUint8Array(dataUrl: string, sliceSize?: number): Uint8Array {
    const scPos = dataUrl.indexOf(';')
    const contentType = dataUrl.substring(5, scPos);
    const header = `data:${contentType};base64,`;
    const b64 = dataUrl.substring(header.length);
    return this.b64ToUint8Array(b64, sliceSize);
  }

  /**
   * Converts a base64 string to a Uint8Array.
   *
   * @param b64Data The base64 string to convert.
   * @param sliceSize Optional size of each slice when converting the base64 string (default: 512).
   * @returns The converted Uint8Array representing the binary data.
   */
  static b64ToUint8Array(b64Data: string, sliceSize?: number): Uint8Array {
    const byteCharacters = atob(b64Data);
    if (sliceSize === undefined) {
      sliceSize = 512;
    }
    let bytes: any[] = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters
        .slice(offset, offset + sliceSize);
      const len = slice.length;
      const byteNumbers = new Array(len);
      for (let i = 0; i < len; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      bytes = bytes.concat(byteNumbers)
    }
    return new Uint8Array(bytes);
  }

  /**
   * Converts a base64 string to a Blob object.
   *
   * @param b64Data The base64 string to convert.
   * @param contentType Optional content type for the Blob (e.g., 'image/png').
   * @param sliceSize Optional slice size for dividing the base64 data into chunks (default: 512).
   * @returns The resulting Blob object with the specified content type.
   */
  static b64ToBlob(
    b64Data: string, contentType?: string,
    sliceSize?: number): Blob {
    const byteCharacters = atob(b64Data);
    const byteArrays = [];
    if (sliceSize === undefined) {
      sliceSize = 512;
    }
    for (let offset = 0;
         offset < byteCharacters.length;
         offset += sliceSize) {
      const slice = byteCharacters
        .slice(offset, offset + sliceSize);
      const len = slice.length;
      const byteNumbers = new Array(len);
      for (let i = 0; i < len; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }
      const byteArray =
        new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }

  /**
   * Generates a blob URL from base64 data for use in previews or downloads.
   *
   * @param b64Data The base64 encoded data.
   * @param contentType Optional MIME type for the Blob (e.g., 'application/pdf').
   * @param sliceSize Optional slice size for chunking the base64 data.
   * @returns A blob URL string that can be used in <img>, <a>, etc.
   */
  static getBlobUrl(b64Data: string, contentType?: string, sliceSize?: number): string {
    const blob = this.b64ToBlob(
      b64Data, contentType, sliceSize);
    return URL.createObjectURL(blob);
  }

}
