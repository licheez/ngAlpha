import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaCommon } from './alpha-common';

describe('AlphaCommon', () => {
  let component: AlphaCommon;
  let fixture: ComponentFixture<AlphaCommon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaCommon]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaCommon);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
