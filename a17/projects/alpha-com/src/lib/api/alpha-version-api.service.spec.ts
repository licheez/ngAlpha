import { TestBed } from '@angular/core/testing';

import { AlphaVersionApiService } from './alpha-version-api.service';
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {IAlphaHttpObjectResultDso} from "../http/alpha-http-result";
import {of, throwError} from "rxjs";

describe('AlphaVersionApiService', () => {

  const getVersionUrl = 'http://getVersion';
  const postErrorLog = jest.fn();

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

  it ('should init', () => {
    const httpClient = {
      get: jest.fn()
    } as unknown as HttpClient;
    service.init(httpClient, getVersionUrl, postErrorLog);
    expect(service['mHttp']).toEqual(httpClient);
    expect(service['mUrl']).toEqual(getVersionUrl);
    expect(service['mContext']).toEqual('AlphaVersionApiService');
    expect(service['postErrorLog']).toEqual(postErrorLog);
  });

  it ('should inject another getVersion method', ()=> {
    const myGetVersion = jest.fn ();
    service.useGetVersion(myGetVersion);
    service.getVersion();
    expect(myGetVersion).toHaveBeenCalled();
  });

  describe('handle getVersion method', () => {

    it ('should use the builtIn method when the mUrl is not set', () => {
     service.getVersion().subscribe({
       next: version => expect(version).toEqual('')
       });
    });

    it ('should use the builtIn method returning ' +
      'an object with success', () => {

      const theVersion = 'someVersion';
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: theVersion
      };

      const httpClient = {
        get: jest.fn(() => of(dso))
      } as unknown as HttpClient;
      const spy =
        jest.spyOn(httpClient, 'get');

      service.init(httpClient, getVersionUrl, postErrorLog);

      service.getVersion().subscribe({
        next: version => expect(version).toEqual(theVersion)
      });

      expect(spy).toHaveBeenCalledWith(getVersionUrl);
    });

    it ('should use the builtIn method returning ' +
      'an primitive with success', () => {

      const theVersion = 'someVersion';
      const httpClient = {
        get: jest.fn(() => of(theVersion))
      } as unknown as HttpClient;
      const spy =
        jest.spyOn(httpClient, 'get');

      service.init(httpClient, getVersionUrl, postErrorLog);

      service.getVersion().subscribe({
        next: version => expect(version).toEqual(theVersion),
        error: () => expect(true).toBeFalsy()
      });
      expect(spy).toHaveBeenCalledWith(getVersionUrl);
    });

    it ('should use the builtIn failing in error', () => {
      const httpClient = {
        get: jest.fn(() =>
          throwError(() => 'someError'))
      } as unknown as HttpClient;
      const spy =
        jest.spyOn(httpClient, 'get');

      service.init(httpClient, getVersionUrl, postErrorLog);
      service.getVersion().subscribe({
        next: () => expect(true).toBeFalsy(),
        error: e => {
          expect(e).toEqual('Internal Server Error');
          expect(postErrorLog).toHaveBeenCalled();
        }
      });

      expect(spy).toHaveBeenCalledWith(getVersionUrl);
    });

  });

});
