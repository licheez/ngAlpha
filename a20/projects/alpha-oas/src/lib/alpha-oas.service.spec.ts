import {TestBed} from '@angular/core/testing';
import {AlphaOasService} from './alpha-oas.service';
import {HttpClient, HttpErrorResponse, provideHttpClient} from '@angular/common/http';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';
import {AlphaAuthStatusEnum, IAlphaAuthEnvelop} from './alpha-oas-abstractions';
import {Observable, of, throwError} from 'rxjs';
import {AlphaRefreshData} from './alpha-refresh-data';
import {AlphaSessionData} from './alpha-session-data';

describe('AlphaOasService', () => {

  const getSessionStorage: () => Storage = () => {
    const store: { [key: string]: string } = {};
    return {
      getItem(key: string): string | null {
        return store[key] || null;
      },
      setItem(key: string, value: string): void {
        store[key] = value;
      },
      removeItem(key: string): void {
        delete store[key];
      }
    } as unknown as Storage;
  };

  const getLocalStorage: () => Storage = () => {
    const store: { [key: string]: string } = {};
    return {
      getItem(key: string): string | null {
        return store[key] || null;
      },
      setItem(key: string, value: string): void {
        store[key] = value;
      },
      removeItem(key: string): void {
        delete store[key];
      }
    } as unknown as Storage;
  };

  const postErrorLog = () => {
  };
  const onPrincipalUpdated = () => {
  };

  let service: AlphaOasService;
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlphaOasService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(AlphaOasService);
    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
    expect(service.principal).toBeTruthy();
  });

  describe('handle undefined httpClient', () => {

    it('should throw an error in signIn when httpClient is not defined', () => {
      expect(() =>
        service.internalSignIn(
          'username',
          'password',
          true))
        .toThrowError('service is not initialized');
    });

    it('should throw an error in refresh when httpClient is not defined', () => {
      expect(() =>
        service.internalRefresh('rt'))
        .toThrowError('service is not initialized');
    });

    it('should throw an error in getMe when httpClient is not defined', () => {
      expect(() =>
        service.getMe())
        .toThrowError('service is not initialized');
    });

  });

  describe('handle init when sd and rd are not set', () => {

    it('should init when sd and rd are not set', () => {
      service.init(httpClient).subscribe({
        next: status => {
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(status).toEqual('anonymous');
        }
      });
    });

  });

  describe('handle init refresh', () => {

    it('should refresh with success', () => {
      const oEnv: IAlphaAuthEnvelop = {
        accessToken: 'accessToken1',
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
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();
      rd.store(lStorage);
      service.init(httpClient,
        undefined, undefined, undefined,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        next: status => {
          expect(status).toEqual('identity refreshed');
          const sd = AlphaSessionData.retrieve(sStorage);
          expect(sd!.accessToken).toEqual('accessToken1');
          const rd = AlphaRefreshData.retrieve(lStorage);
          expect(rd!.refreshToken).toEqual('rt1');
          expect(service.principal.languageCode).toEqual('zh');
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Authenticated);
        }
      });
    });

    it('init should refresh getting a 401', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

      const error401 = {
        status: 401,
        statusText: 'invalid request'
      };

      service.useRefresh(() =>
        throwError(() => error401));

      const rd = new AlphaRefreshData('rt0');
      rd.store(lStorage);
      service.init(httpClient,
        undefined, undefined, undefined,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        next: status => {
          expect(status).toEqual('refresh failed');
        }
      });
    });

    it('init with custom refresh should fail', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

      const rd = new AlphaRefreshData('rt0');
      rd.store(lStorage);
      service.useRefresh(() => throwError(() => 'error'));
      service.init(httpClient,
        undefined, undefined, undefined,
        postErrorLog, onPrincipalUpdated,
        lStorage, sStorage).subscribe({
        error: error => {
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(error).toEqual('error');
        }
      });
    });

    it('init with builtIn refresh should fail', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

      const rd = new AlphaRefreshData('rt0');
      rd.store(lStorage);
      const refreshUrl = 'https://localhost/token';

      service.init(httpClient,
        undefined, refreshUrl, undefined,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        error: error => {
          expect(service.principal.status)
            .toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(error).toBeInstanceOf(HttpErrorResponse);
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('error');
          expect(error.error).toBe('failed');
          expect(error.url).toBe(refreshUrl);
        }
      });

      const req = httpTesting.expectOne(refreshUrl);
      expect(req.request.method).toBe('POST');
      req.flush('failed', {status: 500, statusText: 'error'});

    });

  });

  describe('handle init when sd is set', () => {

    it('init should re-authenticate using getMe', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

      const getMeUrl = 'https://localhost/getMe';
      const now = new Date().getTime();
      const sd = new AlphaSessionData(
        true, 'at',
        now, now + 200000);
      expect(sd.isExpiredOrExpiring).toBeFalsy();
      sd.store(sStorage);

      const userDso = {
        userId: 'userId',
        username: 'username',
        languageCode: 'fr',
        userProperties: {}
      };

      service.init(httpClient,
        getMeUrl, undefined, undefined,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        next: status => {
          expect(status).toEqual('principal reloaded');
        }
      });

      const req = httpTesting.expectOne(getMeUrl);
      expect(req.request.method).toBe('GET');
      req.flush(userDso);

    });

    it('init should fail while re-authenticating', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

      const getMeUrl = 'https://localhost/getMe';
      const now = new Date().getTime();
      const sd = new AlphaSessionData(
        true, 'at',
        now, now + 200000);
      expect(sd.isExpiredOrExpiring).toBeFalsy();
      sd.store(sStorage);
      service.init(httpClient,
        getMeUrl, undefined, undefined,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        error: error => {
          expect(service.principal.status)
            .toEqual(AlphaAuthStatusEnum.Undefined);
          expect(error).toBeInstanceOf(HttpErrorResponse);
          expect(error.status).toBe(500);
          expect(error.statusText).toBe('error');
          expect(error.error).toBe('failed');
          expect(error.url).toBe(getMeUrl);
        }
      });
      const req = httpTesting.expectOne(getMeUrl);
      expect(req.request.method).toBe('GET');
      req.flush('failed', {
        status: 500, statusText: 'error'
      });


    });

    it('init should find an expired sd while calling authorize', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

      // need both getMe and refresh urls
      const getMeUrl = 'https://localhost/getMe';
      const refreshUrl = 'https://localhost/token';

      // need an expiring sd
      const now = new Date().getTime();
      const sd = new AlphaSessionData(
        true, 'at0',
        now - 10, now);
      expect(sd.isExpiredOrExpiring).toBeTruthy();
      sd.store(sStorage);

      // need a rd
      const rd = new AlphaRefreshData('rt1');
      rd.store(lStorage);

      const getMeDso = {
        userId: 'userId',
        username: 'username',
        languageCode: 'fr',
        userProperties: {}
      };
      const refreshDso = {
        access_token: 'at1',
        refresh_token: 'rt1',
        expires_in: 1440,
        user: getMeDso
      };

      service.init(httpClient,
        getMeUrl, refreshUrl, undefined,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        next: status => {
          expect(status).toEqual('principal reloaded');
          const sd = AlphaSessionData.retrieve(sStorage);
          expect(sd?.accessToken).toEqual('at1');
          const rd = AlphaRefreshData.retrieve(lStorage);
          expect(rd?.refreshToken).toEqual('rt1');
          expect(service.principal.languageCode).toEqual('fr');
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Authenticated);
          expect(service.principal.user?.username).toEqual('username');
        }
      });

      const refreshReq = httpTesting.expectOne(refreshUrl);
      expect(refreshReq.request.method).toBe('POST');
      refreshReq.flush(refreshDso);

      const getMeReq = httpTesting.expectOne(getMeUrl);
      expect(getMeReq.request.method).toBe('GET');
      getMeReq.flush(getMeDso);

    });

  });

  describe('handle overrides', () => {

    it('useSignIn should override the builtin signIn method', () => {

      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();
      service.initStorage(sStorage, lStorage);

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

      signIn(
        'username', 'password', true).subscribe({
        next: res => {
          expect(res).toBe(oEnv);
        }
      });

      service.useSignIn(signIn);
      expect(service.internalSignIn).toBe(signIn);

      service.signIn(
        'username', 'password', true).subscribe({
        next: ok => {
          expect(ok).toBeTruthy();
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Authenticated);
          const sd = AlphaSessionData.retrieve(sStorage);
          expect(sd?.accessToken).toEqual('at');
          const rd = AlphaRefreshData.retrieve(lStorage);
          expect(rd?.refreshToken).toEqual('rt');
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

    it ('useRefresh should override the builtin refresh method', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();
      service.initStorage(sStorage, lStorage);

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

      service.useRefresh(mockRefresh);
      expect(service.internalRefresh).toBe(mockRefresh);

    });

  });

  describe('handle authorize', () => {

    it('internal authorize should call refresh', () => {

      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();
      service.initStorage(sStorage, lStorage);

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

      // sd will be null so that refresh is called

      // we need some refresh data
      const rd = new AlphaRefreshData('someToken');
      rd.store(lStorage);

      service.useRefresh(mockRefresh);
      expect(service.internalRefresh).toBe(mockRefresh);

      const originalCall = of('expected result');

      // this will use the built-in authorize
      const authorizedCall = service.authorize(originalCall);

      authorizedCall.subscribe({
        next: (result: string) => {
          expect(result).toEqual('expected result');
          const sd = AlphaSessionData.retrieve(sStorage);
          expect(sd?.accessToken).toEqual('at');
          const rd = AlphaRefreshData.retrieve(lStorage);
          expect(rd?.refreshToken).toEqual('rt');
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
          error: error => {
            expect(error).toEqual('rd should not be null');
          }
        });
      });

  });

  describe('handle signIn', () => {

    it('signIn should succeed', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

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

      service.init(httpClient,
        undefined, undefined, signInUrl,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        next: status => {
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(status).toEqual('anonymous');
        }
      });

      service.signIn(
        'username',
        'password',
        true).subscribe({
        next: signedIn => expect(signedIn).toBeTruthy()
      });

      const req = httpTesting.expectOne(signInUrl);
      expect(req.request.method).toBe('POST');
      req.flush(oEnvDso);

      const sd = AlphaSessionData.retrieve(sStorage);
      expect(sd?.accessToken).toEqual('at');

      const rd = AlphaRefreshData.retrieve(lStorage);
      expect(rd?.refreshToken).toEqual('rt');
      expect(service.principal.languageCode).toEqual('nl');
      expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Authenticated);
    });

    it('signIn should fail with 400', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

      const signInUrl = 'https://localhost/token';
      const error400 = {
        status: 400,
        statusText: 'invalid request'
      };

      service.init(httpClient,
        undefined, undefined, signInUrl,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        next: status => {
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(status).toEqual('anonymous');
        }
      });

      service.signIn(
        'username',
        'password',
        true).subscribe({
        next: signedIn => expect(signedIn).toBeFalsy()
      });

      const req = httpTesting.expectOne(signInUrl);
      expect(req.request.method).toBe('POST');
      req.flush('failed', error400);

      expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);

      const sd = AlphaSessionData.retrieve(sStorage);
      expect(sd).toBeNull();

      const rd = AlphaRefreshData.retrieve(lStorage);
      expect(rd).toBeNull();

    });

    it('signIn should fail with 401', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

      const signInUrl = 'https://localhost/token';

      const error401 = {
        status: 401,
        statusText: 'invalid request'
      };
      service.init(httpClient,
        undefined, undefined, signInUrl,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        next: status => {
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(status).toEqual('anonymous');
        }
      });
      service.signIn(
        'username',
        'password',
        true).subscribe({
        next: signedIn => expect(signedIn).toBeFalsy()
      });

      const req = httpTesting.expectOne(signInUrl);
      expect(req.request.method).toBe('POST');
      req.flush('failed', error401);

      expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);

      const sd = AlphaSessionData.retrieve(sStorage);
      expect(sd).toBeNull();

      const rd = AlphaRefreshData.retrieve(lStorage);
      expect(rd).toBeNull();
    });

    it('signIn should fail with 500', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

      const signInUrl = 'https://localhost/token';
      const error500 = {
        status: 500,
        statusText: 'server error'
      };

      service.init(httpClient,
        undefined, undefined, signInUrl,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        next: status => {
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(status).toEqual('anonymous');
        }
      });

      service.signIn(
        'username',
        'password',
        true).subscribe({
        error: e => expect(e).not.toEqual('')
      });

      const req = httpTesting.expectOne(signInUrl);
      expect(req.request.method).toBe('POST');
      req.flush('failed', error500);

      expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);

      const sd = AlphaSessionData.retrieve(sStorage);
      expect(sd).toBeNull();

      const rd = AlphaRefreshData.retrieve(lStorage);
      expect(rd).toBeNull();

    });

  });

  describe('handle editUserInfo', () => {

    it('editUserInfo should edit user info', () => {
      const lStorage = getLocalStorage();
      const sStorage = getSessionStorage();

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
      service.init( httpClient,
        undefined, undefined, signInUrl,
        postErrorLog, onPrincipalUpdated,
        sStorage, lStorage).subscribe({
        next: status => {
          expect(service.principal.status).toEqual(AlphaAuthStatusEnum.Anonymous);
          expect(status).toEqual('anonymous');
        }
      });

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

      const req = httpTesting.expectOne(signInUrl);
      expect(req.request.method).toBe('POST');
      req.flush(oEnvDso);

    });

    it('editUserInfo should return when user is not set', () => {
      service.editUserInfo('fn', 'ln', 'zh');
      expect(true).toBeTruthy();
    });

  });

});
