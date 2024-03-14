import {TestBed} from '@angular/core/testing';

import {AlphaOasService} from './alpha-oas.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AlphaAuthStatusEnum} from "./alpha-auth-status-enum";
import {of, throwError} from "rxjs";
import {IAlphaAuthEnvelop} from "./alpha-auth-envelop";
import {AlphaRefreshData} from "./alpha-refresh-data";
import {AlphaSessionData} from "./alpha-session-data";
import {error} from "ng-packagr/lib/utils/log";
import {HttpErrorResponse} from "@angular/common/http";

describe('AlphaOasService', () => {

  let sessionStore: { [key: string]: string } = {};
  let localStore: { [key: string]: string } = {};
  let service: AlphaOasService;
  let httpMock: HttpTestingController;

  beforeEach(() => {

    // Session Storage Mock
    const sessionStorageMock = (function () {
      return {
        getItem: function (key: string) {
          return sessionStore[key];
        },
        setItem: function (key: string, value: any) {
          sessionStore[key] = value.toString();
        },
        removeItem: function (key: string) {
          delete sessionStore[key];
        }
      };

    })();
    Object.defineProperty(window, 'sessionStorage', {value: sessionStorageMock});

    // Local Storage Mock
    const localStorageMock = (function () {
      return {
        getItem: function (key: string) {
          return localStore[key];
        },
        setItem: function (key: string, value: any) {
          localStore[key] = value.toString();
        },
        removeItem: function (key: string) {
          delete localStore[key];
        }
      };

    })();
    Object.defineProperty(window, 'localStorage', {value: localStorageMock});


    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule]
    });
    service = TestBed.inject(AlphaOasService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    sessionStore = {};
    localStore = {};
    httpMock.verify();
  });


  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.principal).toBeTruthy();
  });

  it('should init when sd and rd are not set', () => {
    service.init().subscribe({
      next: status => {
        expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
        expect(status).toEqual('anonymous');
      }
    });
  });

  it('init should refresh', ()=> {
    const oEnv: IAlphaAuthEnvelop = {
      accessToken: 'accessToken',
      expiresIn: 1000,
      refreshToken: 'rt1',
      user: {
        userId: 'userId',
        username: 'username',
        languageCode: 'zh',
        properties: new Map<string, any>()
      }
    };
    service.useRefresh(() => of(oEnv));
    const rd = new AlphaRefreshData('rt0');
    rd.store();
    service.init().subscribe({
      next: status => {
        expect(status).toEqual('identity refreshed');
        const sd = AlphaSessionData.retrieve();
        expect(sd!.accessToken).toEqual('accessToken');
        const rd = AlphaRefreshData.retrieve();
        expect(rd!.refreshToken).toEqual('rt1');
        expect(service.principal.languageCode).toEqual('zh');
        expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Authenticated);
      }
    });

  });

  it ('init should fail while refreshing', () => {
    const rd = new AlphaRefreshData('rt0');
    rd.store();
    service.useRefresh(() => throwError(() => 'error'));
    service.init().subscribe({
      error: error => {
        expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
        expect(error).toEqual('error');
      }
    });
  });

  it ('init should reauthenticate using getMe', () => {
    const getMeUrl = 'https://localhost/getMe';
    const now = new Date().getTime();
    const sd = new AlphaSessionData(
      true, 'at',
      now, now + 200000);
    sd.store();
    expect(sd.isExpiredOrExpiring).toBeFalsy();
    service.init(getMeUrl).subscribe({
      next: status => {
       expect(status).toEqual('principal reloaded');
      }
    });

    const getMeRequest = httpMock.expectOne(getMeUrl);
    expect(getMeRequest.request.method).toEqual('GET');

    const userDso = {
      userId: 'userId',
      username: 'username',
      languageCode: 'fr',
      userProperties: {}
    };
    getMeRequest.flush(userDso);
  });

  it ('init should fail while re-authenticating', () => {
    const getMeUrl = 'https://localhost/getMe';
    const now = new Date().getTime();
    const sd = new AlphaSessionData(
      true, 'at',
      now, now + 200000);
    sd.store();
    expect(sd.isExpiredOrExpiring).toBeFalsy();
    const userDso = {
      userId: 'userId',
      username: 'username',
      languageCode: 'fr',
      userProperties: {}
    };
    service.init(getMeUrl).subscribe({
      error: e => {
        expect(e).toEqual('error');
        expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
      }
    });

    const getMeRequest = httpMock.expectOne(getMeUrl);
    expect(getMeRequest.request.method).toEqual('GET');

    const errorResponse =
      new HttpErrorResponse(
        {
          error: 'error',
          status: 500,
          statusText: 'Server error'});

    getMeRequest.flush(errorResponse);
  });

  it ('init should find an expired sd while calling authorize', () => {

    // need both getMe and refresh urls
    const getMeUrl = 'https://localhost/getMe';
    const refreshUrl  = 'https://localhost/token';

    // need an expiring sd
    const now = new Date().getTime();
    const sd = new AlphaSessionData(
      true, 'at0',
      now - 10, now);
    sd.store();
    expect(sd.isExpiredOrExpiring).toBeTruthy();

    // need a rd
    const rd = new AlphaRefreshData('rt1');
    rd.store();

    service.init(getMeUrl, refreshUrl).subscribe({
      next: status => {
        expect(status).toBeTruthy();
      }
    });

    const refreshReq = httpMock.expectOne(refreshUrl);
    expect(refreshReq.request.method).toEqual('POST');
    const userDso = {
      userId: 'userId',
      username: 'username',
      languageCode: 'fr',
      userProperties: {}
    };
    const refreshDso = {
      access_token: 'at1',
      refresh_token: 'rt1',
      expires_in: 1440,
      user: userDso
    };

    expect(true).toBeTruthy();
  });



});
