import {TestBed} from '@angular/core/testing';

import {AlphaUploadApiService} from './alpha-upload-api.service';
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {Observable} from "rxjs";
import {IAlphaHttpObjectResultDso} from "./alpha-http-result";
import {expect, it} from "@jest/globals";
import {response} from "express";

describe('AlphaUploadApiService', () => {

  const uploadUrl = 'http://uploadUrl';
  const deleteUploadUrl = 'http://deleteUploadUrl';
  const authorise: (httpRequest: Observable<any>) => Observable<any> =
    (httpRequest: Observable<any>) => httpRequest;
  const postErrorLog = jest.fn();
  const chunkSize = 1000;

  let service: AlphaUploadApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ HttpClientTestingModule ],
      providers: [ AlphaUploadApiService ]
    });
    service = TestBed.inject(AlphaUploadApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  })

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init', () => {
    service.init(
      uploadUrl, deleteUploadUrl,
      authorise, postErrorLog, chunkSize);
    expect(service["mUploadUrl"]).toEqual(uploadUrl);
    expect(service["mDeleteUploadUrl"]).toEqual(deleteUploadUrl);
    expect(service["mAuthorize"]).toEqual(authorise);
    expect(service["mPostErrorLog"]).toEqual(postErrorLog);
    expect(service["mChunkSize"]).toEqual(chunkSize);
  });

  describe('upload', () => {
    it('should upload some data with success using httpObjectResult API', () => {
      const data = '123456';
      const notifyProgress = (progress: number) => {
        console.log(`Progress: ${progress}%`);
      };

      const objectResultDso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: 'theUploadId'
      };

      service.init(
        uploadUrl, deleteUploadUrl,
        authorise, postErrorLog, 4);
      service.upload(data, notifyProgress)
        .subscribe(uploadId => {
          expect(uploadId).toEqual(objectResultDso.data);
        });

      const r1 = httpMock.expectOne(uploadUrl);
      r1.flush(objectResultDso);

      const r2 = httpMock.expectOne(uploadUrl);
      r2.flush(objectResultDso);
    });

    it('should upload some data with success using plain API', () => {
      const data = '123456';
      const notifyProgress = (progress: number) => {
        console.log(`Progress: ${progress}%`);
      };

      const stringDso = 'theUploadId';

      service.init(
        uploadUrl, deleteUploadUrl,
        authorise, postErrorLog, 4);
      service.upload(data, notifyProgress)
        .subscribe(uploadId => {
          expect(uploadId).toEqual(stringDso);
        });

      const r1 = httpMock.expectOne(uploadUrl);
      r1.flush(stringDso);

      const r2 = httpMock.expectOne(uploadUrl);
      r2.flush(stringDso);
    });


    it ('should fail while uploading some data', () => {
      service.init(
        uploadUrl, deleteUploadUrl,
        authorise, postErrorLog);
      const data = '123456';
      const notifyProgress = (progress: number) => {
        console.log(`Progress: ${progress}%`);
      };
      service.upload(data, notifyProgress)
        .subscribe({
          error: e => expect(e.status).toEqual(500)
        });

      const r1 = httpMock.expectOne(uploadUrl);
      r1.flush({}, {
        status: 500,
        statusText: 'internal error'
      });
    });
  });

  describe('should delete upload', () => {
    it('should delete upload with success', () => {
      const uploadId = 'theUploadId';
      service.init(
        uploadUrl, deleteUploadUrl,
        authorise, postErrorLog);
      service.deleteUpload(uploadId)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });

      const pId = encodeURIComponent(uploadId);
      const url = `${deleteUploadUrl}?uploadId=${pId}`;
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should delete upload returning an error', () => {
      const uploadId = 'theUploadId';
      service.init(
        uploadUrl, deleteUploadUrl,
        authorise, postErrorLog);
      service.deleteUpload(uploadId)
        .subscribe({
          error: e => expect(e).toEqual('internal error')
        });

      const pId = encodeURIComponent(uploadId);
      const url = `${deleteUploadUrl}?uploadId=${pId}`;
      const req = httpMock.expectOne(url);
      expect(req.request.method).toBe('GET');
      req.flush({}, {
        status: 500,
        statusText: 'internal error'
      });
    });


  });

});
