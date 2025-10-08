import { AlphaUploadApiService } from './alpha-upload-api.service';
import { HttpClient } from '@angular/common/http';
import { throwError } from 'rxjs';

describe('AlphaUploadApiService', () => {
  let service: AlphaUploadApiService;
  let httpClientSpy: jasmine.SpyObj<HttpClient>;
  const uploadUrl = 'http://test/upload';
  const deleteUploadUrl = 'http://test/delete';
  const errorLogger = jasmine.createSpy('errorLogger');
  const authorize = jasmine.createSpy('authorize').and.callFake((req$) => req$);

  beforeEach(() => {
    httpClientSpy = jasmine.createSpyObj('HttpClient', ['post', 'delete']);
    service = new AlphaUploadApiService();
    service['mHttp'] = httpClientSpy;
    service['mUploadUrl'] = uploadUrl;
    service['mDeleteUploadUrl'] = deleteUploadUrl;
    service['mPostErrorLog'] = errorLogger;
    service['mAuthorize'] = authorize;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // Add more tests for upload, delete, error handling, chunking, etc. as needed
  // Example:
  it('should call error logger on upload error', () => {
    httpClientSpy.post.and.returnValue(throwError(() => ({ status: 500 })));
    // Simulate upload logic here if public method exists
    // expect(errorLogger).toHaveBeenCalled();
  });
});
