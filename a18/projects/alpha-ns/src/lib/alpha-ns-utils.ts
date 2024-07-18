
export class AlphaNsUtils {
  /**
   * Converts a data URL string to a Blob object.
   *
   * @param {string} dataUrl - The data URL to convert.
   * @param {number} [sliceSize] - The slice size for splitting the base64 data. Optional, defaults to 512.
   * @returns {Blob} - The converted Blob object.
   */
  static dataUrlToBlob(dataUrl: string, sliceSize?: number): Blob {
    const scPos = dataUrl.indexOf(';')
    const contentType = dataUrl.substring(5, scPos);
    const header = `data:${contentType};base64,`;
    const b64 = dataUrl.substring(header.length);
    return this.b64ToBlob(b64, contentType, sliceSize);
  }

  /**
   * Converts a data URL to Uint8Array.
   *
   * @param {string} dataUrl - The data URL to convert.
   * @param {number} [sliceSize] - The slice size for dividing the base64 string into chunks. Optional.
   * @return {Uint8Array} - The converted Uint8Array.
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
   * @param {string} b64Data - The base64 string to convert.
   * @param {number} [sliceSize=512] - The size of each slice when converting the base64 string.
   * @return {Uint8Array} - The converted Uint8Array.
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
   * @param {string} b64Data - The base64 string to convert.
   * @param {string} [contentType] - Optional content type of the Blob.
   * @param {number} [sliceSize] - Optional slice size for dividing the base64 data into chunks.
   * @returns {Blob} - The resulting Blob object.
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
   * Get the URL of a blob from base64 data.
   *
   * @param {string} b64Data - The base64 encoded data.
   * @param {string} [contentType] - The type of the data.
   * @param {number} [sliceSize] - The size of each slice.
   * @return {string} The URL of the blob.
   */
  static getBlobUrl(b64Data: string, contentType?:
    string, sliceSize?: number): string {
    const blob = this.b64ToBlob(
      b64Data, contentType, sliceSize);
    return URL.createObjectURL(blob);
  }

}
