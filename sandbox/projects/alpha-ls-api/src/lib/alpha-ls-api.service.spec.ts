import { TestBed } from '@angular/core/testing';

import { AlphaLsApiService } from './alpha-ls-api.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {AlphaLsApiModule} from "./alpha-ls-api.module";

describe('AlphaLsApiService', () => {
  let service: AlphaLsApiService;
  let httpMock: HttpTestingController;
  const postNavigationLogUrl =  'https://localhost/postNavigationLog';
  const postErrorLogUrl =  'https://localhost/postErrorLog';

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        AlphaLsApiModule.forRoot({
          postNavigationLogUrl: postNavigationLogUrl,
          postErrorLogUrl: postErrorLogUrl
        })
      ],
      providers: [
        AlphaLsApiService
      ]
    });
    service = TestBed.inject(AlphaLsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call postNavigationLog with the correct parameters',
    () => {
    const path = 'testPath';
    const title = 'testTitle';
    spyOn(service, 'postNavigationLog');
    service.usePostNavigationLog((p, t) => {
      expect(p).toBe(path);
      expect(t).toBe(title);
    });
    service.postNavigationLog(path, title);
    expect(service.postNavigationLog).toHaveBeenCalledWith(path, title);
  });

  it('should call postErrorLog with the correct parameters',
    () => {
      const context = 'testContext';
      const method = 'testMethod';
      const error = 'testError';
      spyOn(service, 'postErrorLog');
      service.usePostErrorLog((c, m, e) => {
        expect(c).toBe(context);
        expect(m).toBe(method);
        expect(e).toBe(error);
      });
      service.postErrorLog(context, method, error);
      expect(service.postErrorLog).toHaveBeenCalledWith(context, method, error);
  });

  it ('should submit errLog',
    ()=> {
      const context = 'testContext';
      const method = 'testMethod';
      const error = 'testError';
      service.postErrorLog(context, method, error);

      const req = httpMock.expectOne(postErrorLogUrl);
      const request = req.request;
      expect(request.method).toBe('POST');
      req.flush({});
    });

  it ('should submit pageNavigationLog',
    ()=> {
      const path = 'testPath';
      const title = 'testTitle';
      service.postNavigationLog(path, title);

      const req = httpMock.expectOne(postNavigationLogUrl);
      const request = req.request;
      expect(request.method).toBe('POST');
      req.flush({});
    });

});
