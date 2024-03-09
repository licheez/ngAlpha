import { TestBed } from '@angular/core/testing';

import { AlphaTsService } from './alpha-ts.service';
import {AlphaLbsModule} from "AlphaLbs";

describe('AlphaTsService', () => {
  let service: AlphaTsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [AlphaLbsModule]
    });
    service = TestBed.inject(AlphaTsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
