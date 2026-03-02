import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeNumberInputComponent } from './alpha-prime-number-input.component';

describe('AlphaPrimeNumberInput', () => {
  let component: AlphaPrimeNumberInputComponent;
  let fixture: ComponentFixture<AlphaPrimeNumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeNumberInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
