import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeLoginModalComponent } from './alpha-prime-login-modal.component';

describe('AlphaPrimeLoginModal', () => {
  let component: AlphaPrimeLoginModalComponent;
  let fixture: ComponentFixture<AlphaPrimeLoginModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeLoginModalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeLoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
