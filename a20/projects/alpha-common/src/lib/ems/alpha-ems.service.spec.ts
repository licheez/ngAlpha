import { AlphaEmsService } from './alpha-ems.service';
import { HttpClient } from '@angular/common/http';

describe('AlphaEmsService', () => {
  let service: AlphaEmsService;
  let httpClientMock: HttpClient;

  beforeEach(() => {
    service = new AlphaEmsService();
    httpClientMock = {} as HttpClient;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('httpClient getter', () => {
    it('should throw if not initialized', () => {
      expect(() => service.httpClient).toThrowError('AlphaEmsService is not initialized');
    });
    it('should return httpClient if initialized', () => {
      service.init(httpClientMock);
      expect(service.httpClient).toBe(httpClientMock);
    });
  });

  describe('init', () => {
    it('should set httpClient and default functions', () => {
      service.init(httpClientMock);
      expect(service.httpClient).toBe(httpClientMock);
      // Default functions
      expect(service.authorize).toBeInstanceOf(Function);
      expect(service.postErrorLog).toBeInstanceOf(Function);
      expect(service.publish).toBeInstanceOf(Function);
    });

    it('should override authorize, postErrorLog, and publish if provided', () => {
      const authorize = (req: any) => req;
      const postErrorLog = () => 'logged';
      const publish = () => 'published';
      service.init(httpClientMock, authorize, postErrorLog, publish);
      expect(service.authorize).toBe(authorize);
      expect(service.postErrorLog).toBe(postErrorLog);
      expect(service.publish).toBe(publish);
    });
  });

  describe('default function implementations', () => {
    it('should call default authorize and return observable', () => {
      service.init(httpClientMock);
      const obs = { test: 'observable' } as any;
      expect(service.authorize(obs)).toBe(obs);
    });
    it('should call default postErrorLog and not throw', () => {
      service.init(httpClientMock);
      expect(() => service
        .postErrorLog('ctx', 'method', 'err'))
        .not.toThrow();
    });
    it('should call default publish and not throw', () => {
      service.init(httpClientMock);
      expect(() => service
        .publish('payload', 'channel'))
        .not.toThrow();
    });
  });
});
