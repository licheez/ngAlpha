import {TestBed} from '@angular/core/testing';
import {AlphaUploadApiService} from './alpha-upload-api.service';
import {Observable} from 'rxjs';
import {HttpClient, provideHttpClient} from '@angular/common/http';
import {IAlphaHttpObjectResultDso} from '../http/alpha-http-result';
import {HttpTestingController, provideHttpClientTesting} from '@angular/common/http/testing';

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

  let service: AlphaUploadApiService;
  let httpClient: HttpClient;
  let httpTesting: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AlphaUploadApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });
    service = TestBed.inject(AlphaUploadApiService);
    httpClient = TestBed.inject(HttpClient);
    httpTesting = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTesting.verify();
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
      expect(() => service.upload('some data', () => {
      }))
        .toThrowError('Service is not initialized');
    });

    it('should upload some data with success using httpObjectResult API', (done) => {
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

      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog, 4);
      service.upload(data, notifyProgress)
        .subscribe({
          next: uploadId => {
            expect(uploadId).toEqual(objectResultDso.data);
          }
        });

      const req1 = httpTesting.expectOne(uploadUrl);
      expect(req1.request.method).toBe('POST');
      expect(req1.request.body.dataChunk).toEqual('"123');
      expect(req1.request.body.uploadId).toBeUndefined();
      req1.flush(objectResultDso);

      const req2 = httpTesting.expectOne(uploadUrl);
      expect(req2.request.method).toBe('POST');
      expect(req2.request.body.dataChunk).toEqual('456"');
      expect(req2.request.body.uploadId).toEqual('theUploadId');
      req2.flush(objectResultDso);

      expect(notifyProgress).toHaveBeenCalledTimes(2);
      expect(notifyProgress).toHaveBeenCalledWith(50);
      expect(notifyProgress).toHaveBeenCalledWith(100);

      done();
    });

    it('should upload some data with success using plain API', (done) => {
      const data = '123456';
      const notifyProgress =
        jasmine.createSpy('notifyProgress', (progress: number) => {
          console.log(`Progress: ${progress}%`);
        });
      const stringDso = 'theUploadId';

      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog, 4);

      service.upload(data, notifyProgress)
        .subscribe({
          next: uploadId => {
            expect(uploadId).toEqual(stringDso);
          }
        });

      const req1 = httpTesting.expectOne(uploadUrl);
      expect(req1.request.method).toBe('POST');
      expect(req1.request.body.dataChunk).toEqual('"123');
      expect(req1.request.body.uploadId).toBeUndefined();
      req1.flush(stringDso);

      const req2 = httpTesting.expectOne(uploadUrl);
      expect(req2.request.method).toBe('POST');
      expect(req2.request.body.dataChunk).toEqual('456"');
      expect(req2.request.body.uploadId).toEqual('theUploadId');
      req2.flush(stringDso);

      expect(notifyProgress).toHaveBeenCalledTimes(2);
      expect(notifyProgress).toHaveBeenCalledWith(50);
      expect(notifyProgress).toHaveBeenCalledWith(100);

      done();
    });

    it('should upload some data returning an error', (done) => {
      const data = '123456';

      service.init(httpClient,
        uploadUrl, deleteUploadUrl,
        authorize, postErrorLog, 4);

      service.upload(data, () => {
      })
        .subscribe({
          next: () => {
            fail('should not succeed');
          },
          error: error => {
            expect(error.status).toEqual(500);
          }
        });

      const req = httpTesting.expectOne(uploadUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body.dataChunk).toEqual('"123');
      expect(req.request.body.uploadId).toBeUndefined();
      req.flush('some error',
        {status: 500, statusText: 'Server Error'});

      done();
    });

  });

  describe('should delete upload', () => {

    it('should throw exception when mHttp is undefined', () => {
      expect(() => service.deleteUpload('id'))
        .toThrowError('Service is not initialized');
    });

    it('should delete upload with success', () => {
      const uploadId = 'theUploadId';
      service.init(httpClient,
        uploadUrl, deleteUploadUrl, authorize, postErrorLog);
      service.deleteUpload(uploadId)
        .subscribe({
          next: res => expect(res).toEqual({}),
          error: () => fail('should not fail')
        });
      const pId = encodeURIComponent(uploadId);
      const url = `${deleteUploadUrl}?uploadId=${pId}`;
      const req = httpTesting.expectOne(url);

      expect(req.request.method).toBe('GET');
      req.flush({});
    });

    it('should delete upload returning an error', () => {
      const uploadId = 'theUploadId';
      service.init(httpClient,
        uploadUrl, deleteUploadUrl, authorize, postErrorLog);
      service.deleteUpload(uploadId)
        .subscribe({
          next: () => fail('should not succeed'),
          error: e => expect(e.status).toEqual(500)
        });
      const pId = encodeURIComponent(uploadId);
      const url = `${deleteUploadUrl}?uploadId=${pId}`;
      const req = httpTesting.expectOne(url);

      expect(req.request.method).toBe('GET');
      req.flush('some error',
        {status: 500, statusText: 'Server Error'});
    });

  });

});
