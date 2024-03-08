import { TestBed } from '@angular/core/testing';

import { AlphaLsService } from './alpha-ls.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";

describe('AlphaLsService', () => {
  let service: AlphaLsService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      providers: [
        AlphaLsService
      ]
    });
    service = TestBed.inject(AlphaLsService);
    httpMock = TestBed.inject(HttpTestingController);

  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('tests postNavigationLog method when null', () => {
    service.postNavigationLog('somePath', 'someTitle');
    httpMock.expectNone({});
    httpMock.verify();
    expect(true).toBe(true);
  });

  it('tests postNavigationLog method', () => {
    const url = 'http://test-url.com';
    service.init(undefined, url);
    service.postNavigationLog('somePath', 'someTitle');
    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBeDefined();
    req.flush({});

    httpMock.verify();
  });

  it('tests usePostNavigationLog method', () => {
    const postNavigationLog =
      (path: string, title: string) => {
        expect(path).toEqual('somePath');
      };
    service.usePostNavigationLog(postNavigationLog);
    service.postNavigationLog(
      'somePath','someTitle');
  });

  it('tests postErrorLog method when null', () => {
    service.postErrorLog('someContext',
      'someMethod', 'someError');
    httpMock.expectNone({});
    expect(true).toBe(true);
  });

  it('tests postErrorLog method', () => {
    const url = 'http://test-url.com';
    service.init(url);
    service.postErrorLog('someContext',
      'someMethod', 'someError');
    const req = httpMock.expectOne(url);
    expect(req.request.method).toEqual('POST');
    expect(req.request.body).toBeDefined();
    req.flush({});

    httpMock.verify();
  });

  it('tests usePostErrorLog method', () => {
    const postErrorLog =
      (context: string, method: string, error: string) => {
        expect(context).toEqual('someContext');
      };
    service.usePostErrorLog(postErrorLog);
    service.postErrorLog(
      'someContext',
      'someMethod', 'someError');
  });

});
