import { TestBed } from '@angular/core/testing';

import { AlphaLbsService } from './alpha-lbs.service';

describe('AlphaLbsService', () => {
  let service: AlphaLbsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaLbsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
