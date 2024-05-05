import {TestBed} from '@angular/core/testing';

import {AlphaUtils} from './alpha-utils';
import {TextDecoder} from 'util';

describe('AlphaComService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({});
    global.URL.createObjectURL = jest.fn(
      (b: Blob) => `blob:${b}`);
  });

  it('eon should return whether or not a string is null or empty', () => {
    let r = AlphaUtils.eon('');
    expect(r).toBeTruthy();
    r = AlphaUtils.eon('  ');
    expect(r).toBeTruthy();
    r = AlphaUtils.eon(undefined);
    expect(r).toBeTruthy();
    r = AlphaUtils.eon('some info');
    expect(r).toBeFalsy();
  });

  it('isNull should return whether or not a variable is null', () => {
    let r = AlphaUtils.isNull(null);
    expect(r).toBeTruthy();
    r = AlphaUtils.isNull(undefined);
    expect(r).toBeTruthy();
  });

  it('toNumberOrNull should convert string to number', () => {
    let r = AlphaUtils.toNumberOrNull('');
    expect(r).toBeNull();
    r = AlphaUtils.toNumberOrNull('10');
    expect(r).toEqual(10);
  });

  it('contains checks it the searched string is found', () => {
    let r = AlphaUtils.contains('Abc', 'b');
    expect(r).toBeTruthy();
    r = AlphaUtils.contains('Abc', 'd');
    expect(r).toBeFalsy();
    r = AlphaUtils.contains('Abc', 'a');
    expect(r).toBeFalsy();
  });

  it('should format number local currency', () => {
    const r = AlphaUtils.toLocaleCurrency(
      123.45, 'be');
    expect(r).toEqual('123,45 €');
  });

  it('should return rounded number without decimals if precision is not set', () => {
    const result = AlphaUtils.round(1.2345);
    expect(result).toEqual(1);
  });

  it('should return rounded number with specified precision', () => {
    const result = AlphaUtils.round(1.2345, 2);
    expect(result).toEqual(1.23);
  });

  it('should work correctly on negative numbers', () => {
    const result = AlphaUtils.round(-1.2345, 2);
    expect(result).toEqual(-1.23);
  });

  it('should return original number if precision matches number of decimals', () => {
    const result = AlphaUtils.round(1.23, 2);
    expect(result).toEqual(1.23);
  });

  it('should return zero if the input is zero regardless of precision', () => {
    const result = AlphaUtils.round(0, 2);
    expect(result).toEqual(0);
  });

  it('should return a Blob from a data URL', () => {
    const testContent = 'Hello, world!;';
    const testContentType = 'text/plain';
    const dataUrl = `data:${testContentType};base64,`
      + btoa(testContent);
    const result = AlphaUtils.dataUrlToBlob(dataUrl);

    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBe(testContent.length);
    expect(result.type).toBe(testContentType);
  });

  it('should handle optional sliceSize parameter', () => {
    const testContent = 'Hello, world!';
    const testContentType = 'text/plain';
    const dataUrl = `data:${testContentType};base64,`
      + btoa(testContent);
    const result = AlphaUtils
      .dataUrlToBlob(dataUrl, 512);

    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBe(testContent.length);
    expect(result.type).toBe(testContentType);
  });

  it('should correctly convert dataUrl to Uint8Array', () => {
    const sampleDataUrl =
      'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='; // "Hello, World!"
    const uint8Array = AlphaUtils.dataUrlToUint8Array(sampleDataUrl);
    const decoder = new TextDecoder();
    const result = decoder.decode(uint8Array);
    expect(result).toBe('Hello, World!');
  });

  it('should correctly convert sliced dataUrl to Uint8Array', () => {
    const sampleDataUrl = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='; // "Hello, World!"
    const uint8Array = AlphaUtils.dataUrlToUint8Array(sampleDataUrl, 5);
    const result = new TextDecoder("utf-8")
      .decode(uint8Array);

    expect(result).toBe('Hello, World!');
  });

  it('should throw error when non-base64 string is provided', () => {
    const sampleDataUrl = 'data:text/plain;invalid,SGVsbG8sIFdvcmxkIQ==';

    expect(() => AlphaUtils.dataUrlToUint8Array(sampleDataUrl)).toThrow();
  });

  it('returns a blob URL', () => {

    const originalString = 'Hello World!';
    const b64 = btoa(originalString);
    const contentType = "text/plain";
    const url = AlphaUtils.getBlobUrl(b64, contentType);

    expect(url).toContain('blob:');
  });

});
