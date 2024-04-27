import { TestBed } from '@angular/core/testing';

import { AlphaVersionApiService } from './alpha-version-api.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpErrorResponse} from "@angular/common/http";
import {IAlphaLoggerService} from "@pvway/alpha-common";
import {IAlphaHttpObjectResultDso} from "@pvway/alpha-common";

describe('AlphaVersionApiService', () => {

  const getVersionUrl = 'http://getVersion';
  const ls = {
    postErrorLog: jest.fn()
  } as any as IAlphaLoggerService;

  let service: AlphaVersionApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AlphaVersionApiService]
    });
    service = TestBed.inject(AlphaVersionApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should init', () => {
    service.init(getVersionUrl, ls);
    expect(service['mUrl']).toEqual(getVersionUrl);
    expect(service['mContext']).toEqual('AlphaVersionApiService');
    expect(service['postErrorLog']).toEqual(ls.postErrorLog);
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
      service.init(getVersionUrl, ls);

      const theVersion = 'someVersion';
      const dso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: theVersion
      };

      service.getVersion().subscribe({
        next: version => expect(version).toEqual(theVersion)
      });

      const req = httpMock.expectOne(getVersionUrl);
      req.flush(dso);
    });

    it ('should use the builtIn method returning ' +
      'an primitive with success', () => {
      service.init(getVersionUrl, ls);

      const theVersion = 'someVersion';

      service.getVersion().subscribe({
        next: version => expect(version).toEqual(theVersion),
        error: () => expect(true).toBeFalsy()
      });

      const req = httpMock.expectOne(getVersionUrl);
      req.flush(theVersion);
    });

    it ('should use the builtIn failing in error', () => {
      service.init(getVersionUrl, ls);
      service.getVersion().subscribe({
        next: () => expect(true).toBeFalsy(),
        error: e => {
          expect(e).toEqual('Internal Server Error');
          expect(ls.postErrorLog).toHaveBeenCalled();
        }
      });
      const errorResponse: HttpErrorResponse = new HttpErrorResponse(
        { status: 500, statusText: 'Internal Server Error' });
      const req = httpMock.expectOne(getVersionUrl);
      req.flush({}, errorResponse);
    });

  });

});
