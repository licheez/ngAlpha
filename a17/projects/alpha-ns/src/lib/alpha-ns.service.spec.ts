import { TestBed } from '@angular/core/testing';

import { AlphaNsService } from './alpha-ns.service';

describe('AlphaNsService', () => {
  let service: AlphaNsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaNsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
