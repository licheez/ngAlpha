import { AlphaVersionApiService } from './alpha-version-api.service';
import { HttpClient } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import {IAlphaHttpObjectResultDso} from '../http/alpha-http-result';

describe('AlphaVersionApiService', () => {
  let service: AlphaVersionApiService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const url = 'http://test/version';
  const errorLogger = jasmine.createSpy('errorLogger');

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['get']);
    service = new AlphaVersionApiService();
    service.init(httpClientSpy, url, errorLogger);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return empty string if not initialized', () => {
    const svc = new AlphaVersionApiService();
    svc.useGetVersion(svc['getVersionBuiltIn'].bind(svc));
    svc['mHttp'] = undefined;
    svc['mUrl'] = undefined;
    svc.init(httpClientSpy, '', errorLogger);
    svc['mHttp'] = undefined;
    svc['mUrl'] = undefined;
    svc.getVersion().subscribe(result => {
      expect(result).toBe('');
    });
  });

  it('should call getVersionBuiltIn and return string from dso', () => {
    const theVersion = '1.2.3';
    const dso: IAlphaHttpObjectResultDso = {
      statusCode: 'O',
      mutationCode: 'N',
      notifications: [],
      hasMoreResults: false,
      data: theVersion
    };
    httpClientSpy.get.and.returnValue(of(dso));
    service.getVersion().subscribe(result => {
      expect(result).toBe(theVersion);
    });
  });

  it('should call getVersionBuiltIn and return string directly', () => {
    httpClientSpy.get.and.returnValue(of('2.3.4'));
    service.getVersion().subscribe(result => {
      expect(result).toBe('2.3.4');
    });
  });

  it('should handle error and call error logger', () => {
    const error = { status: 404, message: 'Not found' };
    httpClientSpy.get.and.returnValue(throwError(() => error));
    service.getVersion().subscribe({
      error: err => {
        expect(errorLogger).toHaveBeenCalled();
        expect(err).toEqual(error);
      }
    });
  });

  it('should allow custom getVersion implementation', () => {
    service.useGetVersion(() => of('custom'));
    service.getVersion().subscribe(result => {
      expect(result).toBe('custom');
    });
  });
});

