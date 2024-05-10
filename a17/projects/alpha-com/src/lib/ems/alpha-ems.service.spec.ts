import { TestBed } from '@angular/core/testing';

import { AlphaEmsService } from './alpha-ems.service';
import {HttpClient} from "@angular/common/http";

describe('AlphaEmsService', () => {
  let service: AlphaEmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaEmsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it ('should init', () => {
    const authorize = jest.fn();
    const postErrorLog = jest.fn();
    const publish = jest.fn();
    const httpClient = {} as unknown as HttpClient;
    service.init(httpClient, authorize, postErrorLog, publish);
    expect(service.httpClient).toEqual(httpClient);
    expect(service.authorize).toEqual(authorize);
    expect(service.postErrorLog).toEqual(postErrorLog);
    expect(service.publish).toEqual(publish);
  });

  it('get httpClient should throw when service is not initialized', () => {
    expect(() => service.httpClient)
      .toThrow('AlphaEmsService is not initialized');
  });

});
