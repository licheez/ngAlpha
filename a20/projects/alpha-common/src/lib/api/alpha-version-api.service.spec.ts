import { TestBed } from '@angular/core/testing';
import { AlphaVersionApiService } from './alpha-version-api.service';
import { HttpClient } from '@angular/common/http';
import { IAlphaHttpObjectResultDso } from '../http/alpha-http-result';
import { of, throwError } from 'rxjs';

describe('AlphaVersionApiService', () => {
  const getVersionUrl = 'http://getVersion';
  const postErrorLog = jasmine.createSpy('postErrorLog');
  let service: AlphaVersionApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlphaVersionApiService]
    });
    service = TestBed.inject(AlphaVersionApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service['mHttp']).toBeUndefined();
  });

  it('should init', () => {
    const httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    service.init(httpClient, getVersionUrl, postErrorLog);
    expect(service['mHttp']).toEqual(httpClient);
    expect(service['mUrl']).toEqual(getVersionUrl);
    expect(service['mContext']).toEqual('AlphaVersionApiService');
    expect(service['postErrorLog']).toEqual(postErrorLog);
  });

  it('should inject another getVersion method', () => {
    const myGetVersion = jasmine.createSpy('myGetVersion');
    service.useGetVersion(myGetVersion);
    service.getVersion();
    expect(myGetVersion).toHaveBeenCalled();
  });

  describe('handle getVersion method', () => {
    it('should use the builtIn method when the mUrl is not set', () => {
      service.getVersion().subscribe({
        next: version => expect(version).toEqual('')
      });
    });

    it('should use the builtIn method returning an object with success', () => {
      const theVersion = 'someVersion';
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: theVersion
      };
      const httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
      httpClient.get.and.returnValue(of(dso));
      service.init(httpClient, getVersionUrl, postErrorLog);
      let result: unknown;
      service.getVersion().subscribe({
        next: version => result = version
      });
      expect(result).toEqual(theVersion);
      expect(httpClient.get).toHaveBeenCalledWith(getVersionUrl);
    });

    it('should use the builtIn method returning a primitive with success', () => {
      const theVersion = 'someVersion';
      const httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
      httpClient.get.and.returnValue(of(theVersion));
      service.init(httpClient, getVersionUrl, postErrorLog);
      let result: unknown;
      service.getVersion().subscribe({
        next: version => result = version,
        error: () => expect(true).toBeFalsy()
      });
      expect(result).toEqual(theVersion);
      expect(httpClient.get).toHaveBeenCalledWith(getVersionUrl);
    });

    it('should use the builtIn failing in error', () => {
      const httpClient =
        jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
      const error = 'someError';
      httpClient.get.and.returnValue(throwError(() => error));
      service.init(httpClient, getVersionUrl, postErrorLog);
      //let errorResult: unknown;
      service.getVersion().subscribe({
        next: () => expect(true).toBeFalsy(),
        error: e => {
          //errorResult = e;
          expect(e).toEqual(error);
          expect(postErrorLog).toHaveBeenCalled();
        }
      });
      //expect(errorResult).toEqual('Internal Server Error');
      expect(httpClient.get).toHaveBeenCalledWith(getVersionUrl);
    });
  });
});
