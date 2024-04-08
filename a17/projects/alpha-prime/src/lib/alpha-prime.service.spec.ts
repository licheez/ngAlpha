import { TestBed } from '@angular/core/testing';

import { AlphaPrimeService } from './alpha-prime.service';

describe('AlphaPrimeService', () => {
  let service: AlphaPrimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaPrimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
