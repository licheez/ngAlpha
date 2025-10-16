import {AlphaOasInterceptor} from "./alpha-oas-interceptor";
import {HttpHandler, HttpRequest, HttpResponse} from '@angular/common/http';
import {TestBed} from '@angular/core/testing';
import {of} from 'rxjs';
import {AlphaSessionData} from './alpha-session-data';

describe('AlphaOasInterceptor', () => {

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

  let service: AlphaOasInterceptor;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlphaOasInterceptor
      ]
    });

    service = TestBed.inject(AlphaOasInterceptor);

  });

  it('should create an instance', () => {
    expect(service).toBeTruthy();
  });

  it('should set language-code and clientId', (done) => {
    const sStorage = getSessionStorage();
    const lStorage = getLocalStorage();
    service.initStorage(sStorage, lStorage);

    const httpReq: HttpRequest<any> = new HttpRequest<any>('GET', '/test-url');
    const httpResponse: HttpResponse<any> = new HttpResponse({status: 200});
    const httpHandler: HttpHandler = {
      handle: () => of(httpResponse)
    };

    const now = new Date().getTime();
    const sd = new AlphaSessionData(
      true,
      'at',
      now, now + 10000);
    sd.store(sStorage);

    service.intercept(httpReq, httpHandler)
      .subscribe(evn => {

        expect(evn).toBe(httpResponse);

        const resp = evn as HttpResponse<any>;
        expect(resp.status).toBe(200);

        const languageCode = sStorage.getItem('alphaLanguageCode');
        expect(languageCode).toEqual('en');
        const clientId = lStorage.getItem('alphaClientId');
        expect(clientId).not.toBeNull();

        done();
      });

  });

  it('should provide an handlerFn', (done) => {
    const sStorage = getSessionStorage();
    const lStorage = getLocalStorage();

    const httpReq: HttpRequest<any> = new HttpRequest<any>('GET', '/test-url');
    const httpResponse: HttpResponse<any> = new HttpResponse({status: 200});
    const httpHandler: HttpHandler = {
      handle: () => of(httpResponse)
    };
    const httpHandlerFn: (req: HttpRequest<any>) => any =
      (req: HttpRequest<any>) => httpHandler.handle(req);

    AlphaOasInterceptor.handlerFn(
      httpReq, httpHandlerFn, sStorage, lStorage).subscribe({
      next: httpEvent => {

        expect(httpEvent).toBe(httpResponse);

        const resp = httpEvent as HttpResponse<any>;
        expect(resp.status).toBe(200);

        const languageCode = sStorage.getItem('alphaLanguageCode');
        expect(languageCode).toEqual('en');
        const clientId = lStorage.getItem('alphaClientId');
        expect(clientId).not.toBeNull();

        done();
      }
    });

  });

});
