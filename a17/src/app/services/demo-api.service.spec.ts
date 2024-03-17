import { TestBed } from '@angular/core/testing';

import { DemoApiService } from './demo-api.service';

describe('DemoApiService', () => {
  let service: DemoApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DemoApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
