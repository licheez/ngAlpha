import { TestBed } from '@angular/core/testing';

import { AlphaOasService } from './alpha-oas.service';

describe('AlphaOasService', () => {
  let service: AlphaOasService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaOasService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
