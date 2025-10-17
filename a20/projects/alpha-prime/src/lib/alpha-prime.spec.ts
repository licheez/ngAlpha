import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrime } from './alpha-prime';

describe('AlphaPrime', () => {
  let component: AlphaPrime;
  let fixture: ComponentFixture<AlphaPrime>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrime]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrime);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
