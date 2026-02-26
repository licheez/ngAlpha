import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimePasswordInputComponent } from './alpha-prime-password-input.component';

describe('AlphaPrimePasswordInput', () => {
  let component: AlphaPrimePasswordInputComponent;
  let fixture: ComponentFixture<AlphaPrimePasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimePasswordInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimePasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
