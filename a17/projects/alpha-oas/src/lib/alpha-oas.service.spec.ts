import {TestBed} from '@angular/core/testing';

import {AlphaOasService} from './alpha-oas.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

import {Observable, of, throwError} from "rxjs";

import {AlphaRefreshData} from "./alpha-refresh-data";
import {AlphaSessionData} from "./alpha-session-data";
import {HttpErrorResponse} from "@angular/common/http";
import {AlphaAuthStatusEnum, IAlphaAuthEnvelop, IAlphaLoggerService} from "@pvway/alpha-common";

describe('AlphaOasService', () => {

  let sessionStore: { [key: string]: string } = {};
  let localStore: { [key: string]: string } = {};
  let service: AlphaOasService;
  let httpMock: HttpTestingController;
  const ls = {
    postErrorLog: jest.fn()
  } as any as IAlphaLoggerService;
  const onPrincipalUpdated = jest.fn();

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

  it('init should refresh', () => {
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
    service.init(
      undefined, undefined, undefined,
      ls, onPrincipalUpdated).subscribe({
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

  it('init should fail while refreshing', () => {
    const rd = new AlphaRefreshData('rt0');
    rd.store();
    service.useRefresh(() => throwError(() => 'error'));
    service.init(
      undefined, undefined, undefined,
      ls, onPrincipalUpdated).subscribe({
      error: error => {
        expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
        expect(error).toEqual('error');
      }
    });
  });

  it('init should fail with 401 while refreshing', () => {
    const rd = new AlphaRefreshData('rt0');
    rd.store();
    const refreshUrl = 'https://localhost/token';
    service.init(
      undefined, refreshUrl, undefined,
      ls, onPrincipalUpdated).subscribe({
      error: error => {
        expect(service.principal.status)
          .toEqual(AlphaAuthStatusEnum.Anonymous);
        expect(error).toEqual('error');
      }
    });
    const refreshReq = httpMock.expectOne(refreshUrl);
    refreshReq.flush({},{
      status: 401,
      statusText: 'not authorized'
    });
  });

  it('init should reauthenticate using getMe', () => {
    const getMeUrl = 'https://localhost/getMe';
    const now = new Date().getTime();
    const sd = new AlphaSessionData(
      true, 'at',
      now, now + 200000);
    sd.store();
    expect(sd.isExpiredOrExpiring).toBeFalsy();
    service.init(
      getMeUrl, undefined, undefined,
      ls, onPrincipalUpdated).subscribe({
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

  it('init should fail while re-authenticating', () => {
    const getMeUrl = 'https://localhost/getMe';
    const now = new Date().getTime();
    const sd = new AlphaSessionData(
      true, 'at',
      now, now + 200000);
    sd.store();
    expect(sd.isExpiredOrExpiring).toBeFalsy();
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
          statusText: 'Server error'
        });

    getMeRequest.flush(errorResponse);
  });

  it('init should find an expired sd while calling authorize', () => {

    // need both getMe and refresh urls
    const getMeUrl = 'https://localhost/getMe';
    const refreshUrl = 'https://localhost/token';

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

    service.init(
      getMeUrl, refreshUrl, undefined,
      ls, onPrincipalUpdated).subscribe({
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
    refreshReq.flush(refreshDso);

    const getMeReq = httpMock.expectOne(getMeUrl);
    expect(getMeReq.request.method).toEqual('GET');
    getMeReq.flush(userDso);

    expect(true).toBeTruthy();
  });

  it('useSignIn should override the builtin signIn method', () => {

    const oEnv: IAlphaAuthEnvelop = {
      accessToken: 'at',
      refreshToken: 'rt',
      expiresIn: 1000,
      user: {
        userId: 'userId',
        username: 'username',
        languageCode: 'fr',
        properties: new Map<string, any>()
      }
    };

    const signIn: (username: string, password: string, rememberMd: boolean)
      => Observable<IAlphaAuthEnvelop> = () => of(oEnv);

    service.useSignIn(signIn);
    service.signIn(
      'userName',
      'password',
      true).subscribe({
      next: ok => {
        expect(ok).toBeTruthy();
      }
    });
  });

  it('useAuthorize should override the builtin authorize method', () => {
    const passThrough: (request: Observable<any>) => Observable<any> =
      request => of(request);

    service.useAuthorize(passThrough);
    const originalCall = of('expected result');
    const authorizedCall = service.authorize(originalCall);

    authorizedCall.subscribe({
      next: (request: Observable<string>) => {
        expect(request).toEqual(originalCall);
        request.subscribe({
          next: (result: string) => expect(result)
            .toEqual('expected result')
        });
      }
    });
  });

  it('authorize should call refresh', () => {

    const oEnv: IAlphaAuthEnvelop = {
      accessToken: 'at',
      refreshToken: 'rt',
      expiresIn: 1000,
      user: {
        userId: 'userId',
        username: 'username',
        languageCode: 'zh',
        properties: new Map<string, any>()
      }
    }
    const mockRefresh: (token: string) => Observable<IAlphaAuthEnvelop> =
      () => of(oEnv);

    const rd = new AlphaRefreshData('someToken');
    rd.store();

    service.useRefresh(mockRefresh);

    const originalCall = of('expected result');
    const authorizedCall = service.authorize(originalCall);

    authorizedCall.subscribe({
      next: (request: Observable<string>) => {
        expect(request).toEqual(originalCall);
        request.subscribe({
          next: (result: string) => expect(result)
            .toEqual('expected result')
        });
      }
    });
  });

  it('authorize should fail while refreshing because rd is null',
    () => {

    const oEnv: IAlphaAuthEnvelop = {
      accessToken: 'at',
      refreshToken: 'rt',
      expiresIn: 1000,
      user: {
        userId: 'userId',
        username: 'username',
        languageCode: 'zh',
        properties: new Map<string, any>()
      }
    }
    const mockRefresh: (token: string) => Observable<IAlphaAuthEnvelop> =
      () => of(oEnv);

    service.useRefresh(mockRefresh);

    const originalCall = of('expected result');
    const authorizedCall = service.authorize(originalCall);

    authorizedCall.subscribe({
      next: (request: Observable<string>) => {
        expect(request).toEqual(originalCall);
        request.subscribe({
          error: e => expect(e).toEqual('rd should not be null')
        });
      }
    });
  });

  it('signIn should succeed', () => {
    const signInUrl = 'https://localhost/token';
    service.init(undefined, undefined, signInUrl);

    const oEnvDso = {
      access_token: 'at',
      refresh_token: 'rt',
      expires_in: 1440,
      user: {
        userId: 'userId',
        username: 'username',
        languageCode: 'nl',
        userProperties: {}
      }
    };

    service.signIn(
      'username',
      'password',
      true).subscribe({
      next: signedIn => expect(signedIn).toBeTruthy()
    });

    const signInReq = httpMock.expectOne(signInUrl);
    expect(signInReq.request.method).toEqual('POST');

    signInReq.flush(oEnvDso);
  });

  it('signIn should fail with 400', () => {
    const signInUrl = 'https://localhost/token';
    service.init(undefined, undefined, signInUrl);

    service.signIn(
      'username',
      'password',
      true).subscribe({
      next: signedIn => expect(signedIn).toBeFalsy()
    });

    const signInReq = httpMock.expectOne(signInUrl);
    expect(signInReq.request.method).toEqual('POST');

    signInReq.flush({}, {
      status: 400,
      statusText: 'invalid request'
    });
  });

  it('signIn should fail with 401', () => {
    const signInUrl = 'https://localhost/token';
    service.init(undefined, undefined, signInUrl);

    service.signIn(
      'username',
      'password',
      true).subscribe({
      next: signedIn => expect(signedIn).toBeFalsy()
    });

    const signInReq = httpMock.expectOne(signInUrl);
    expect(signInReq.request.method).toEqual('POST');

    signInReq.flush({}, {
      status: 401,
      statusText: 'invalid request'
    });
  });

  it('signIn should fail with 500', () => {
    const signInUrl = 'https://localhost/token';
    service.init(undefined, undefined, signInUrl);

    service.signIn(
      'username',
      'password',
      true).subscribe({
      error: e => expect(e).not.toEqual('')
    });

    const signInReq = httpMock.expectOne(signInUrl);
    expect(signInReq.request.method).toEqual('POST');

    signInReq.flush({}, {
      status: 500,
      statusText: 'server error'
    });
  });

  it('editUserInfo should edit user info', () => {

    const signInUrl = 'https://localhost/token';
    service.init(undefined, undefined, signInUrl);

    const oEnvDso = {
      access_token: 'at',
      refresh_token: 'rt',
      expires_in: 1440,
      user: {
        userId: 'userId',
        username: 'username',
        languageCode: 'nl',
        userProperties: {}
      }
    };

    service.signIn(
      'username',
      'password',
      true).subscribe({
      next: signedIn => {
        expect(signedIn).toBeTruthy();
        service.editUserInfo(
          'firstName',
          'lastName',
          'zh');
        const user = service.principal.user!;
        expect(user.username).toEqual('firstName lastName');
        expect(user.languageCode).toEqual('zh');
      }
    });

    const signInReq = httpMock.expectOne(signInUrl);
    expect(signInReq.request.method).toEqual('POST');

    signInReq.flush(oEnvDso);
  });

  it('editUserInfo should return when user is not set', () => {
    service.editUserInfo('fn', 'ln', 'zh');
    expect(true).toBeTruthy();
  })
});
