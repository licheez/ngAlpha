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
});
