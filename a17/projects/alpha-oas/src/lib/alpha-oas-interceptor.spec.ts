import {AlphaOasInterceptor} from "./alpha-oas-interceptor";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {TestBed} from "@angular/core/testing";
import {AlphaOasService} from "./alpha-oas.service";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {AlphaSessionData} from "./alpha-session-data";

describe('AlphaOasInterceptor', () => {

  let sessionStore: { [key: string]: string } = {};
  let localStore: { [key: string]: string } = {};
  let httpMock: HttpTestingController;
  let service: AlphaOasService;

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
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AlphaOasInterceptor, multi: true }
      ]
    });
    httpMock = TestBed.inject(HttpTestingController);
    service = TestBed.inject(AlphaOasService);
  });

  afterEach(() => {
    sessionStore = {};
    localStore = {};
    httpMock.verify();
  });

  it('should create an instance', () => {
    expect(new AlphaOasInterceptor()).toBeTruthy();
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
    service.init(undefined, undefined, signInUrl);
    service.signIn(
      'username', 'password', true)
      .subscribe();
    const req = httpMock.expectOne(signInUrl);
    req.flush({}, {
      status: 401,
      statusText: 'invalid credentials'
    });
    expect(req.request.headers.has('Authorization'));
    expect(req.request.headers.get('Authorization'))
      .toEqual('bearer at');
    expect(req.request.headers.get('language-code'))
      .toEqual('en');
    expect(req.request.headers.get('client-id'))
      .toBeTruthy();
  });
});
