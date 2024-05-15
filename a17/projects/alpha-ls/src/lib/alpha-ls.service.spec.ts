import { TestBed } from '@angular/core/testing';

import { AlphaLsService } from './alpha-ls.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {of, throwError} from "rxjs";

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
    const httpClient = {
      post: jest.fn(
        () => of({}))
    } as unknown as HttpClient;
    const spy = jest.spyOn(httpClient, 'post');

    const url = 'https://test-url.com';
    service.init(httpClient, undefined, url);
    service.postNavigationLog('somePath', 'someTitle');
    expect(spy).toHaveBeenCalledWith(url,
      {"clientReferrer": "", "path": "somePath", "title": "someTitle"});
  });

  it('tests usePostNavigationLog method', () => {
    const postNavigationLog =
      (path: string, title: string) => {
        expect(path).toEqual('somePath');
        expect(title).toEqual('someTitle');
      };
    service.usePostNavigationLog(postNavigationLog);
    service.postNavigationLog(
      'somePath','someTitle');
  });

  it('usePostNavigationLog should fail', () => {
    const errorResponse =
      new HttpErrorResponse(
        {
          error: 'test 400 error',
          status: 400,
          statusText: 'Bad Request'});
    const url = 'http://localhost:8080';
    const httpClient = {
      post: jest.fn(
        () => throwError(()=>errorResponse))
    } as unknown as HttpClient;
    const spy = jest.spyOn(httpClient, 'post');
    service.init(httpClient, undefined, url);
    jest.spyOn(console, 'error');
    service.postNavigationLog(
      'somePath', 'someTitle');
    expect(spy).toHaveBeenCalledWith(url,
      {"clientReferrer": "", "path": "somePath", "title": "someTitle"})
    expect(console.error).toHaveBeenCalled();
  });

  it('tests postErrorLog method when null', () => {
    service.postErrorLog('someContext',
      'someMethod', 'someError');
    httpMock.expectNone({});
    expect(true).toBe(true);
  });

  it('tests postErrorLog method', () => {
    const httpClient = {
      post: jest.fn(
        () => of({}))
    } as unknown as HttpClient;
    const spy = jest.spyOn(httpClient, 'post');
    const url = 'https://test-url.com';
    service.init(httpClient, url);
    service.postErrorLog('someContext','someMethod', 'someError');
    expect(spy).toHaveBeenCalledWith(url,
      {"context": "someContext", "error": "someError", "method": "someMethod"})
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
    const errorResponse =
      new HttpErrorResponse(
        {
          error: 'test 400 error',
          status: 400,
          statusText: 'Bad Request'});
    const httpClient = {
      post: jest.fn(
        () => throwError(() => errorResponse))
    } as unknown as HttpClient;
    const spy = jest.spyOn(httpClient, 'post');
    const url = 'http://localhost:8080';
    service.init(httpClient, url);
    jest.spyOn(console, 'error');
    service.postErrorLog(
      'someContext', 'someMethod', 'someError');
    expect(spy).toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

});
