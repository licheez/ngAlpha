import { TestBed } from '@angular/core/testing';

import { AlphaLsApiService } from './alpha-ls-api.service';

describe('AlphaLsApiService', () => {
  let service: AlphaLsApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaLsApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
