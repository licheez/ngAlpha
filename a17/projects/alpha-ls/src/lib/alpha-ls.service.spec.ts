import { TestBed } from '@angular/core/testing';

import { AlphaLsService } from './alpha-ls.service';

describe('AlphaLsService', () => {
  let service: AlphaLsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaLsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
