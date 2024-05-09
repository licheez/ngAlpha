import {TestBed} from '@angular/core/testing';

import {AlphaOasService} from './alpha-oas.service';

import {Observable, of, throwError} from "rxjs";

import {AlphaRefreshData} from "./alpha-refresh-data";
import {AlphaSessionData} from "./alpha-session-data";
import {HttpClient} from "@angular/common/http";
import {AlphaAuthStatusEnum, IAlphaAuthEnvelop} from "./alpha-oas-abstractions";
import {error} from "ng-packagr/lib/utils/log";

describe('AlphaOasService', () => {

  let sessionStore: { [key: string]: string } = {};
  let localStore: { [key: string]: string } = {};
  let service: AlphaOasService;
  const httpClient = {
    post: jest.fn(),
    get: jest.fn()
  } as unknown as HttpClient;
  const postErrorLog= jest.fn();
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
    });
    service = TestBed.inject(AlphaOasService);
  });

  afterEach(() => {
    sessionStore = {};
    localStore = {};
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.principal).toBeTruthy();
  });

  describe('handle undefined httpClient', () => {
    it ('should throw an error in signIn when httpClient is not defined', () => {
      expect(() =>
        service.internalSignIn (
        'username',
        'password',
        true))
        .toThrow('service is not initialized');
    });

    it ('should throw an error in refresh when httpClient is not defined', () => {
      expect(() =>
        service.internalRefresh('rt'))
        .toThrow('service is not initialized');
    });

    it ('should throw an error in getMe when httpClient is not defined', () => {
      expect(() =>
        service.getMe()).toThrow('service is not initialized');
    });

  });

  it('should init when sd and rd are not set', () => {
    service.init(httpClient).subscribe({
      next: status => {
        expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
        expect(status).toEqual('anonymous');
      }
    });
  });

  describe('init from refresh data', () => {

    it('init should refresh with success', () => {
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
      service.init(httpClient,
        undefined, undefined, undefined,
        postErrorLog, onPrincipalUpdated).subscribe({
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

    it('init should refresh getting a 401', () => {
      const error401 = {
        status: 401,
        statusText: 'invalid request'
      };
      service.useRefresh(() =>
        throwError(() => error401));
      const rd = new AlphaRefreshData('rt0');
      rd.store();
      service.init(httpClient,
        undefined, undefined, undefined,
        postErrorLog, onPrincipalUpdated).subscribe({
        next: status => {
          expect(status).toEqual('refresh failed');
        }
      });
    });

    it('init with custom refresh should fail', () => {
      const rd = new AlphaRefreshData('rt0');
      rd.store();
      service.useRefresh(() => throwError(() => 'error'));
      service.init(httpClient,
        undefined, undefined, undefined,
        postErrorLog, onPrincipalUpdated).subscribe({
        error: error => {
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(error).toEqual('error');
        }
      });
    });

    it('init with builtIn refresh should fail', () => {
      const rd = new AlphaRefreshData('rt0');
      rd.store();
      const refreshUrl = 'https://localhost/token';
      const httpClient = {
        post: jest.fn(() =>
          throwError(() => 'error'))
      } as unknown as HttpClient;
      const spy =
        jest.spyOn(httpClient, 'post');

      service.init(httpClient,
        undefined, refreshUrl, undefined,
        postErrorLog, onPrincipalUpdated).subscribe({
        error: error => {
          expect(service.principal.status)
            .toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(error).toEqual('error');
        }
      });
      expect(spy).toHaveBeenCalled();
    });

    it('refresh returns false', () => {

      // we need some refresh data
      const rd = new AlphaRefreshData('rt0');
      rd.store();

      const error401 = {
        status: 401,
        statusText: 'invalid request'
      };
      const httpClient = {
        post: jest.fn(() =>
          throwError(() => error401))
      } as unknown as HttpClient;
      service.init(httpClient);
      const spy =
        jest.spyOn(httpClient, 'post');
      service.refresh().subscribe({
        next: ok => expect(ok).toBeFalsy()
      });
      expect(spy).toHaveBeenCalled();
    });

  });

  it('init should re-authenticate using getMe', () => {
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
    const httpClient = {
      get: jest.fn(() => of(userDso))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'get');

    service.init(httpClient,
      getMeUrl, undefined, undefined,
      postErrorLog, onPrincipalUpdated).subscribe({
      next: status => {
        expect(status).toEqual('principal reloaded');
      }
    });
    expect(spy).toHaveBeenCalled();
  });

  it('init should fail while re-authenticating', () => {
    const getMeUrl = 'https://localhost/getMe';
    const now = new Date().getTime();
    const sd = new AlphaSessionData(
      true, 'at',
      now, now + 200000);
    sd.store();
    expect(sd.isExpiredOrExpiring).toBeFalsy();
    const httpClient = {
      get: jest.fn(() =>
        throwError(() => 'error'))
    } as unknown as HttpClient ;
    const spy =
      jest.spyOn(httpClient, 'get');
    service.init(httpClient, getMeUrl).subscribe({
      error: e => {
        expect(e).toEqual('error');
        expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
      }
    });
    expect(spy).toHaveBeenCalled();
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
    const httpClient = {
      get: jest.fn(() => of(userDso)),
      post: jest.fn(() => of(refreshDso))
    } as unknown as HttpClient;
    const spyGet =
      jest.spyOn(httpClient, 'get');
    const spyPost =
      jest.spyOn(httpClient, 'post');

    service.init(httpClient,
      getMeUrl, refreshUrl, undefined,
      postErrorLog, onPrincipalUpdated).subscribe({
      next: status => {
        expect(status).toBeTruthy();
      }
    });

    expect(spyGet).toHaveBeenCalled();
    expect(spyPost).toHaveBeenCalled();
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
    const mockRefresh: (token: string) =>
      Observable<IAlphaAuthEnvelop> =
      () => of(oEnv);

    // sd will be null

    // we need some refresh data
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
    const httpClient = {
      post: jest.fn(() => of(oEnvDso))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'post');

    service.init(httpClient,
      undefined, undefined, signInUrl);

    service.signIn(
      'username',
      'password',
      true).subscribe({
      next: signedIn => expect(signedIn).toBeTruthy()
    });
    expect(spy).toHaveBeenCalled();
  });

  it('signIn should fail with 400', () => {
    const signInUrl = 'https://localhost/token';
    const error400 = {
      status: 400,
      statusText: 'invalid request'
    };
    const httpClient = {
      post: jest.fn(() =>
        throwError(() => error400))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'post');

    service.init(httpClient,
      undefined, undefined, signInUrl);

    service.signIn(
      'username',
      'password',
      true).subscribe({
      next: signedIn => expect(signedIn).toBeFalsy()
    });

    expect(spy).toHaveBeenCalled();
  });

  it('signIn should fail with 401', () => {
    const signInUrl = 'https://localhost/token';

    const error401 = {
      status: 401,
      statusText: 'invalid request'
    };
    const httpClient = {
      post: jest.fn(() =>
        throwError(() => error401))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'post');
    service.init(httpClient,
      undefined, undefined, signInUrl);
    service.signIn(
      'username',
      'password',
      true).subscribe({
      next: signedIn => expect(signedIn).toBeFalsy()
    });
    expect(spy).toHaveBeenCalled();
  });

  it('signIn should fail with 500', () => {
    const signInUrl = 'https://localhost/token';
    const error500 = {
      status: 500,
      statusText: 'server error'
    };
    const httpClient = {
      post: jest.fn(() =>
        throwError(() => error500))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'post');

    service.init(httpClient,
      undefined, undefined, signInUrl);

    service.signIn(
      'username',
      'password',
      true).subscribe({
      error: e => expect(e).not.toEqual('')
    });

    expect(spy).toHaveBeenCalled();
  });

  it('editUserInfo should edit user info', () => {

    const signInUrl = 'https://localhost/token';

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
    const httpClient = {
      post: jest.fn(() => of(oEnvDso))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'post');
    service.init( httpClient,undefined, signInUrl);

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

    expect(spy).toHaveBeenCalled();
  });

  it('editUserInfo should return when user is not set', () => {
    service.editUserInfo('fn', 'ln', 'zh');
    expect(true).toBeTruthy();
  })

});
