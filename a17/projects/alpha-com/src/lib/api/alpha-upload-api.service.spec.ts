import {TestBed} from '@angular/core/testing';

import {AlphaUploadApiService} from './alpha-upload-api.service';
import {Observable, of, throwError} from "rxjs";
import {expect, it, jest} from "@jest/globals";
import {HttpClient} from "@angular/common/http";
import {IAlphaHttpObjectResultDso} from "../http/alpha-http-result";

describe('AlphaUploadApiService', () => {

  const uploadUrl = 'http://uploadUrl';
  const deleteUploadUrl = 'http://deleteUploadUrl';
  const authorize = jest.fn(
    (httpRequest: Observable<any>) => httpRequest);
  const postErrorLog = jest.fn();
  const chunkSize = 1000;
  const httpClient = {
    get: jest.fn(),
    post: jest.fn()
  } as unknown as HttpClient;

  let service: AlphaUploadApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ AlphaUploadApiService ]
    });
    service = TestBed.inject(AlphaUploadApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should init', () => {
    service.init(
      httpClient, uploadUrl, deleteUploadUrl,
      authorize, postErrorLog, chunkSize);
    expect(service['mHttp']).toEqual(httpClient);
    expect(service['mUploadUrl']).toEqual(uploadUrl);
    expect(service['mDeleteUploadUrl']).toEqual(deleteUploadUrl);
    expect(service['mAuthorize']).toEqual(authorize);
    expect(service['mPostErrorLog']).toEqual(postErrorLog);
    expect(service['mChunkSize']).toEqual(chunkSize);
  });

  describe('upload', () => {
    it('should throw exception when mHttp is undefined', () => {
      expect(() => service.upload('some data', jest.fn()))
        .toThrowError('Service is not initialized');
    });

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

      const httpClient = {
        post: jest.fn(() => of(objectResultDso))
      } as unknown as HttpClient;
      const spy =
        jest.spyOn(httpClient, 'post');

      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog, 4);
      service.upload(data, notifyProgress)
        .subscribe(uploadId => {
          expect(uploadId).toEqual(objectResultDso.data);
        });

      expect(spy.mock.calls[0]).toEqual(
        [
          uploadUrl, { dataChunk: '"123', uploadId: undefined }
        ]);
      expect(spy.mock.calls[1]).toEqual(
        [
          uploadUrl, { dataChunk: '456"', uploadId: 'theUploadId' }
        ]);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should upload some data with success using plain API', () => {
      const data = '123456';
      const notifyProgress = (progress: number) => {
        console.log(`Progress: ${progress}%`);
      };

      const stringDso = 'theUploadId';
      const httpClient = {
        post: jest.fn(() => of(stringDso))
      } as unknown as HttpClient;
      const spy =
        jest.spyOn(httpClient, 'post');

      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog, 4);
      service.upload(data, notifyProgress)
        .subscribe(uploadId => {
          expect(uploadId).toEqual(stringDso);
        });

      expect(spy.mock.calls[0]).toEqual(
        [
          uploadUrl, { dataChunk: '"123', uploadId: undefined }
        ]);
      expect(spy.mock.calls[1]).toEqual(
        [
          uploadUrl, { dataChunk: '456"', uploadId: 'theUploadId' }
        ]);
      expect(spy).toHaveBeenCalledTimes(2);
    });

    it ('should fail while uploading some data', () => {
      const httpClient = {
        post: jest.fn(() =>
          throwError(() => 'someError'))
      } as unknown as HttpClient;
      const spy = jest.spyOn(httpClient, 'post');
      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog);
      const data = '123456';
      const notifyProgress = (progress: number) => {
        console.log(`Progress: ${progress}%`);
      };
      service.upload(data, notifyProgress)
        .subscribe({
          error: e => expect(e).toEqual('someError')
        });
      expect(spy).toHaveBeenCalledWith(
        uploadUrl, {"dataChunk": "\"123456\"", "uploadId": undefined});
    });
  });

  describe('should delete upload', () => {

    it('should throw exception when mHttp is undefined', () => {
      expect(() => service.deleteUpload('id'))
        .toThrowError('Service is not initialized');
    });

    it('should delete upload with success', () => {
      const httpClient = {
        get: jest.fn(() => of({}))
      } as unknown as HttpClient;
      const spy = jest.spyOn(httpClient, 'get');
      const uploadId = 'theUploadId';
      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog);
      service.deleteUpload(uploadId)
        .subscribe(response => {
          expect(response).toBeTruthy();
        });

      const pId = encodeURIComponent(uploadId);
      const url = `${deleteUploadUrl}?uploadId=${pId}`;
      expect(spy).toHaveBeenCalledWith(url);
    });

    it('should delete upload returning an error', () => {
      const httpClient = {
        get: jest.fn(() => throwError(()=>'someError'))
      } as unknown as HttpClient;
      const spy = jest.spyOn(httpClient, 'get');
      const uploadId = 'theUploadId';
      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog);
      service.deleteUpload(uploadId)
        .subscribe({
          error: e => expect(e).toEqual('someError')
        });

      const pId = encodeURIComponent(uploadId);
      const url = `${deleteUploadUrl}?uploadId=${pId}`;
      expect(spy).toHaveBeenCalledWith(url);
    });
  });

});
