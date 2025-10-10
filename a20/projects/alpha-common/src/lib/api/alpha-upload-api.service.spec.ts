import { TestBed } from '@angular/core/testing';
import { AlphaUploadApiService } from './alpha-upload-api.service';
import { Observable, of, throwError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { IAlphaHttpObjectResultDso } from '../http/alpha-http-result';

describe('AlphaUploadApiService', () => {
  const uploadUrl = 'http://uploadUrl';
  const deleteUploadUrl = 'http://deleteUploadUrl';
  const authorize =
    <T>(httpRequest: Observable<T>): Observable<T> => httpRequest;
  const postErrorLog =
    (context: string, method: string, error: string): void => {
    console.log(`Error in ${context}.${method}: ${error}`);
  };
  const chunkSize = 1000;

  const httpClient = {
    get: jasmine.createSpy('get'),
    post: jasmine.createSpy('post')
  } as unknown as HttpClient;

  let service: AlphaUploadApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlphaUploadApiService]
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
      expect(() => service.upload('some data', () => {}))
        .toThrowError('Service is not initialized');
    });

    it('should upload some data with success using httpObjectResult API', (done) => {
      class HttpClientMock {
        public postCalls: Array<{ url: string, body: any, options?: any }> = [];
        //public getCalls: Array<{ url: string, options?: any }> = [];
        constructor(private result: any) {}
        post(url: string, body: any, options?: any) {
          this.postCalls.push({ url, body, options });
          return of(this.result);
        }
        // get(url: string, options?: any) {
        //   this.getCalls.push({ url, options });
        //   return of(this.result);
        // }
      }
      const data = '123456';
      const notifyProgress =
        jasmine.createSpy('notifyProgress', (progress: number) => {
        console.log(`Progress: ${progress}%`);
      });
      const objectResultDso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: 'theUploadId'
      };
      const httpClient = new HttpClientMock(objectResultDso);
      service.init(httpClient as unknown as HttpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog, 4);
      service.upload(data, notifyProgress)
        .subscribe({
          next: uploadId => {
            expect(uploadId).toEqual(objectResultDso.data);
            expect(httpClient.postCalls.length).toBe(2);
            expect(httpClient.postCalls[0].url).toBe(uploadUrl);
            expect(httpClient.postCalls[0].body.dataChunk).toEqual('"123');
            expect(httpClient.postCalls[0].body.uploadId).toBeUndefined();
            expect(httpClient.postCalls[1].url).toBe(uploadUrl);
            expect(httpClient.postCalls[1].body.dataChunk).toEqual('456"');
            expect(httpClient.postCalls[1].body.uploadId).toEqual('theUploadId');
            done();
          }
        });
    });

    /*
    it('should upload some data with success using plain API', (done) => {
      class HttpClientMock {
        public postCalls: Array<{ url: string, body: any, options?: any }> = [];
        //public getCalls: Array<{ url: string, options?: any }> = [];
        constructor(private result: any) {}
        post(url: string, body: any, options?: any) {
          this.postCalls.push({ url, body, options });
          return of(this.result);
        }
        // get(url: string, options?: any) {
        //   this.getCalls.push({ url, options });
        //   return of(this.result);
        // }
      }
      const data = '123456';
      const notifyProgress =
        jasmine.createSpy('notifyProgress', (progress: number) => {
          console.log(`Progress: ${progress}%`);
        });
      const objectResultDso: IAlphaHttpObjectResultDso = {
        statusCode: 'O',
        mutationCode: 'N',
        notifications: [],
        hasMoreResults: false,
        data: 'theUploadId'
      };
      const httpClient = new HttpClientMock(objectResultDso);
      service.init(httpClient as unknown as HttpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog, 4);
      service.upload(data, notifyProgress)
        .subscribe({
          next: uploadId => {
            expect(uploadId).toEqual(objectResultDso.data);
            expect(httpClient.postCalls.length).toBe(2);
            expect(httpClient.postCalls[0].url).toBe(uploadUrl);
            expect(httpClient.postCalls[0].body.dataChunk).toEqual('"123');
            expect(httpClient.postCalls[0].body.uploadId).toBeUndefined();
            expect(httpClient.postCalls[1].url).toBe(uploadUrl);
            expect(httpClient.postCalls[1].body.dataChunk).toEqual('456"');
            expect(httpClient.postCalls[1].body.uploadId).toEqual('theUploadId');
            done();
          }
        });
    });

    /*
    it('should upload some data with success using plain API', () => {
      const data = '123456';
      const notifyProgress =
        jasmine.createSpy('notifyProgress', (progress: number) => {
          console.log(`Progress: ${progress}%`);
        });
      const stringDso = 'theUploadId';
      const httpClient =
        jasmine.createSpyObj<HttpClient>(
          'HttpClient', ['post']);
      httpClient.post.and.returnValue(of(stringDso));
      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog, 4);

      const call0 = httpClient.post.calls.argsFor(0);
      expect(call0).toEqual([uploadUrl, { dataChunk: '"123', uploadId: undefined }]);
      const call1 = httpClient.post.calls.argsFor(1);
      expect(call1).toEqual([uploadUrl, { dataChunk: '456"', uploadId: 'theUploadId' }]);
      expect(httpClient.post.calls.count()).toBe(2);
    });

    it('should fail while uploading some data', () => {
      const httpClient =
        jasmine.createSpyObj<HttpClient>('HttpClient', ['post']);
      httpClient.post.and.returnValue(throwError(() => 'someError'));

      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog);
      const data = '123456';
      const notifyProgress = jasmine.createSpy(
        'notifyProgress', (progress: number) => {
          console.log(`Progress: ${progress}%`);
        });
      service.upload(data, notifyProgress).subscribe({
        error: e => expect(e).toEqual('someError')
      });
      expect(httpClient.post).toHaveBeenCalledWith(
        uploadUrl, { dataChunk: '"123456"', uploadId: undefined }
      );
    });

     */
  });

  /*
  describe('should delete upload', () => {
    it('should throw exception when mHttp is undefined', () => {
      expect(() => service.deleteUpload('id'))
        .toThrowError('Service is not initialized');
    });

    it('should delete upload with success', () => {
      const httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
      httpClient.get.and.returnValue(of({}));
      const uploadId = 'theUploadId';
      service.init(httpClient, uploadUrl, deleteUploadUrl, authorize, postErrorLog);
      let result: unknown;
      service.deleteUpload(uploadId).subscribe(response => {
        result = response;
      });
      const pId = encodeURIComponent(uploadId);
      const url = `${deleteUploadUrl}?uploadId=${pId}`;
      expect(result).toBeTruthy();
      expect(httpClient.get).toHaveBeenCalledWith(url);
    });

    it('should delete upload returning an error', () => {
      const httpClient = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
      httpClient.get.and.returnValue(throwError(() => 'someError'));
      const uploadId = 'theUploadId';
      service.init(httpClient, uploadUrl, deleteUploadUrl, authorize, postErrorLog);
      let errorResult: unknown;
      service.deleteUpload(uploadId).subscribe({
        error: e => errorResult = e
      });
      const pId = encodeURIComponent(uploadId);
      const url = `${deleteUploadUrl}?uploadId=${pId}`;
      expect(errorResult).toEqual('someError');
      expect(httpClient.get).toHaveBeenCalledWith(url);
    });
  });

   */
});
