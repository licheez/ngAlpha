import { TestBed } from '@angular/core/testing';

import { AlphaTsService } from './alpha-ts.service';
describe('AlphaTsService', () => {
  let service: AlphaTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
