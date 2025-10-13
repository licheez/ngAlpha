import {TestBed} from '@angular/core/testing';

import {AlphaLsService} from './alpha-ls.service';
import {HttpTestingController, provideHttpClientTesting} from "@angular/common/http/testing";
import {HttpClient, provideHttpClient} from "@angular/common/http";

describe('AlphaLsService', () => {

  let service: AlphaLsService;
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlphaLsService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AlphaLsService);
    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('test postNavigationLog method when null', () => {
    service.postNavigationLog('somePath', 'someTitle');
    httpTesting.expectNone({});
    httpTesting.verify();
    expect(true).toBe(true);
  });

  it('test postNavigationLog method', () => {
    const url = 'https://test-url.com';
    service.init(httpClient, undefined, url);
    service.postNavigationLog('somePath', 'someTitle');
    const req = httpTesting.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.clientReferrer).not.toBeUndefined();
    expect(req.request.body.path).toEqual('somePath');
    expect(req.request.body.title).toEqual('someTitle');
    req.flush({});
  });

  it('test usePostNavigationLog method', () => {
    const postNavigationLog =
      (path: string, title: string) => {
        expect(path).toEqual('somePath');
        expect(title).toEqual('someTitle');
      };
    service.usePostNavigationLog(postNavigationLog);
    service.postNavigationLog(
      'somePath', 'someTitle');
  });

  it('usePostNavigationLog should fail', () => {
    const url = 'http://localhost:8080';
    service.init(httpClient, undefined, url);
    spyOn(console, 'error');
    service.postNavigationLog('somePath', 'someTitle');
    const req = httpTesting.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.clientReferrer).not.toBeUndefined();
    expect(req.request.body.path).toEqual('somePath');
    expect(req.request.body.title).toEqual('someTitle');
    req.flush('test 400 error', {
      status: 400,
      statusText: 'Bad Request'
    });
    expect(console.error).toHaveBeenCalled();
  });

  it('test postErrorLog method when null', () => {
    service.postErrorLog('someContext',
      'someMethod', 'someError');
    httpTesting.expectNone({});
    expect(true).toBe(true);
  });

  it('test postErrorLog method', () => {
    const url = 'https://test-url.com';
    service.init(httpClient, url);
    service.postErrorLog('someContext', 'someMethod', 'someError');
    const req = httpTesting.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.context).toEqual("someContext");
    expect(req.request.body.method).toEqual('someMethod');
    expect(req.request.body.error).toEqual('someError');
    req.flush({});
  });

  it('tests usePostErrorLog method', () => {
    const postErrorLog =
      (context: string, method: string, error: string) => {
        expect(context).toEqual('someContext');
        expect(method).toEqual('someMethod');
        expect(error).toEqual('someError');
      };
    service.usePostErrorLog(postErrorLog);
    service.postErrorLog(
      'someContext',
      'someMethod', 'someError');
  });

  it('usePostErrorLog should fail', () => {
    const url = 'http://localhost:8080';
    service.init(httpClient, url);
    spyOn(console, 'error');
    service.postErrorLog('someContext', 'someMethod', 'someError');
    const req = httpTesting.expectOne(url);
    expect(req.request.method).toBe('POST');
    expect(req.request.body.context).toEqual("someContext");
    expect(req.request.body.method).toEqual('someMethod');
    expect(req.request.body.error).toEqual('someError');
    req.flush('test 400 error', {
      status: 400,
      statusText: 'Bad Request'
    });
    expect(console.error).toHaveBeenCalled();
  });

});
