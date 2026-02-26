import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeLoginFormComponent } from './alpha-prime-login-form.component';

describe('AlphaPrimeLoginForm', () => {
  let component: AlphaPrimeLoginFormComponent;
  let fixture: ComponentFixture<AlphaPrimeLoginFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeLoginFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeLoginFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
