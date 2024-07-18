import { AlphaNsUtils } from './alpha-ns-utils';
import {TextDecoder} from "util";

describe('AlphaNsUtils', () => {

  beforeEach(() => {
    global.URL.createObjectURL = jest.fn(
      (b: Blob) => `blob:${b}`);
  });

  it('should create an instance', () => {
    expect(new AlphaNsUtils()).toBeTruthy();
  });

  it('should return a Blob from a data URL', () => {
    const testContent = 'Hello, world!;';
    const testContentType = 'text/plain';
    const dataUrl = `data:${testContentType};base64,`
      + btoa(testContent);
    const result = AlphaNsUtils.dataUrlToBlob(dataUrl);

    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBe(testContent.length);
    expect(result.type).toBe(testContentType);
  });

  it('should handle optional sliceSize parameter', () => {
    const testContent = 'Hello, world!';
    const testContentType = 'text/plain';
    const dataUrl = `data:${testContentType};base64,`
      + btoa(testContent);
    const result = AlphaNsUtils
      .dataUrlToBlob(dataUrl, 512);

    expect(result).toBeInstanceOf(Blob);
    expect(result.size).toBe(testContent.length);
    expect(result.type).toBe(testContentType);
  });

  it('should correctly convert dataUrl to Uint8Array', () => {
    const sampleDataUrl =
      'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='; // "Hello, World!"
    const uint8Array = AlphaNsUtils.dataUrlToUint8Array(sampleDataUrl);
    const decoder = new TextDecoder();
    const result = decoder.decode(uint8Array);
    expect(result).toBe('Hello, World!');
  });

  it('should correctly convert sliced dataUrl to Uint8Array', () => {
    const sampleDataUrl = 'data:text/plain;base64,SGVsbG8sIFdvcmxkIQ=='; // "Hello, World!"
    const uint8Array = AlphaNsUtils.dataUrlToUint8Array(sampleDataUrl, 5);
    const result = new TextDecoder("utf-8")
      .decode(uint8Array);

    expect(result).toBe('Hello, World!');
  });

  it('should throw error when non-base64 string is provided', () => {
    const sampleDataUrl = 'data:text/plain;invalid,SGVsbG8sIFdvcmxkIQ==';

    expect(() => AlphaNsUtils.dataUrlToUint8Array(sampleDataUrl)).toThrow();
  });

  it('returns a blob URL', () => {

    const originalString = 'Hello World!';
    const b64 = btoa(originalString);
    const contentType = "text/plain";
    const url = AlphaNsUtils.getBlobUrl(b64, contentType);

    expect(url).toContain('blob:');
  });

});
