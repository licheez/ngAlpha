import { AlphaNsUtils } from './alpha-ns-utils';

describe('AlphaNsUtils', () => {
  const base64 = btoa('Hello, world!');
  const contentType = 'text/plain';
  const dataUrl = `data:${contentType};base64,${base64}`;

  describe('dataUrlToBlob', () => {
    it('should convert a data URL to a Blob', () => {
      const blob = AlphaNsUtils.dataUrlToBlob(dataUrl);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe(contentType);
    });
    it('should handle custom sliceSize', () => {
      const blob = AlphaNsUtils.dataUrlToBlob(dataUrl, 2);
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('dataUrlToUint8Array', () => {
    it('should convert a data URL to Uint8Array', () => {
      const arr = AlphaNsUtils.dataUrlToUint8Array(dataUrl);
      expect(arr).toBeInstanceOf(Uint8Array);
      expect(arr.length).toBeGreaterThan(0);
    });
    it('should handle custom sliceSize', () => {
      const arr = AlphaNsUtils.dataUrlToUint8Array(dataUrl, 2);
      expect(arr).toBeInstanceOf(Uint8Array);
    });
  });

  describe('b64ToUint8Array', () => {
    it('should convert base64 to Uint8Array', () => {
      const arr = AlphaNsUtils.b64ToUint8Array(base64);
      expect(arr).toBeInstanceOf(Uint8Array);
      expect(arr.length).toBeGreaterThan(0);
    });
    it('should handle custom sliceSize', () => {
      const arr = AlphaNsUtils.b64ToUint8Array(base64, 2);
      expect(arr).toBeInstanceOf(Uint8Array);
    });
    it('should handle empty base64', () => {
      const arr = AlphaNsUtils.b64ToUint8Array('', 2);
      expect(arr).toBeInstanceOf(Uint8Array);
      expect(arr.length).toBe(0);
    });
  });

  describe('b64ToBlob', () => {
    it('should convert base64 to Blob', () => {
      const blob = AlphaNsUtils.b64ToBlob(base64, contentType);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.type).toBe(contentType);
    });
    it('should handle custom sliceSize', () => {
      const blob = AlphaNsUtils.b64ToBlob(base64, contentType, 2);
      expect(blob).toBeInstanceOf(Blob);
    });
    it('should handle empty base64', () => {
      const blob = AlphaNsUtils.b64ToBlob('', contentType, 2);
      expect(blob).toBeInstanceOf(Blob);
      expect(blob.size).toBe(0);
    });
    it('should handle undefined contentType', () => {
      const blob = AlphaNsUtils.b64ToBlob(base64);
      expect(blob).toBeInstanceOf(Blob);
    });
  });

  describe('getBlobUrl', () => {
    let createObjectURLSpy: jasmine.Spy;

    beforeEach(() => {
      createObjectURLSpy = spyOn(URL, 'createObjectURL')
        .and.returnValue('blob:url');
    });

    it('should get a blob URL from base64', () => {
      const url = AlphaNsUtils.getBlobUrl(base64, contentType);
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(url).toBe('blob:url');
    });

    it('should handle custom sliceSize', () => {
      const url = AlphaNsUtils.getBlobUrl(base64, contentType, 2);
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(url).toBe('blob:url');
    });

    it('should handle undefined contentType', () => {
      const url = AlphaNsUtils.getBlobUrl(base64);
      expect(createObjectURLSpy).toHaveBeenCalled();
      expect(url).toBe('blob:url');
    });
  });
});

