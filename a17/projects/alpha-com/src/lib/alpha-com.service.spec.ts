import { TestBed } from '@angular/core/testing';

import { AlphaComService } from './alpha-com.service';

describe('AlphaComService', () => {
  let service: AlphaComService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
