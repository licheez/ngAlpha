import {AlphaOasInterceptor} from "./alpha-oas-interceptor";
import {TestBed} from "@angular/core/testing";
import {AlphaOasService} from "./alpha-oas.service";
import {HTTP_INTERCEPTORS, HttpClient, HttpRequest, HttpResponse} from "@angular/common/http";
import {AlphaSessionData} from "./alpha-session-data";
import {of, throwError} from "rxjs";
import {jest} from "@jest/globals";

describe('AlphaOasInterceptor', () => {

  let sessionStore: { [key: string]: string } = {};
  let localStore: { [key: string]: string } = {};
  let oasService: AlphaOasService;

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
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AlphaOasInterceptor, multi: true }
      ]
    });
    oasService = TestBed.inject(AlphaOasService);
  });

  afterEach(() => {
    sessionStore = {};
    localStore = {};
  });

  it('should create an instance', () => {
    const service = new AlphaOasInterceptor();
    expect(service).toBeTruthy();
  });

  it ('should read client-id from the local storage', () => {
    localStore['alphaClientId'] = '123456789';
    expect(new AlphaOasInterceptor()).toBeTruthy();
  });

  it ('should intercept requests', () => {

    const sd = new AlphaSessionData(
      true,
      'at',
      10, 1000);
    sd.store();

    const signInUrl = 'https://localhost/token';
    const err401 = {
      status: 401,
      statusText: 'invalid credentials'
    };
    const httpClient = {
      post: jest.fn(() => throwError(() => err401))
    } as unknown as HttpClient;
    const spy =
      jest.spyOn(httpClient, 'post');
    oasService.init( httpClient, undefined, signInUrl);
    oasService.signIn(
      'username', 'password', true)
      .subscribe();
    expect(spy).toHaveBeenCalled();
  });

  it ('should intercept some request', () => {
    const service = new AlphaOasInterceptor();
    const httpRequest = new
    HttpRequest<any>('GET', 'https://example.com');
    const httpHandler = {
      handle: jest.fn(() => of(new HttpResponse()))
    };
    const sd = new AlphaSessionData(
      true, 'token',0, 10);
    sd.store();
    sessionStorage.setItem('token', 'someToken');
    service.intercept(httpRequest, httpHandler)
      .subscribe({
        next: evn => {
          expect(evn).toBeInstanceOf(HttpResponse);
        }
      });
  });

  it ('should provide an handlerFn', () => {
    const httpRequest = new
    HttpRequest<any>('GET', 'https://example.com');
    const httpHandlerFn =
      jest.fn(() => of(new HttpResponse()));

    const sd = new AlphaSessionData(
      true, 'token',0, 10);
    sd.store();
    sessionStorage.setItem('token', 'someToken');
    const hFn =
      AlphaOasInterceptor.handlerFn(httpRequest, httpHandlerFn)
    hFn.subscribe({
      next: evn =>
        expect(evn).toBeInstanceOf(HttpResponse)
    });
  });



});
