import { TestBed } from '@angular/core/testing';

import { AlphaEmsService } from './alpha-ems.service';

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
    service.init(authorize, postErrorLog, publish);
    expect(service.authorize).toEqual(authorize);
    expect(service.postErrorLog).toEqual(postErrorLog);
    expect(service.publish).toEqual(publish);
  })
});
