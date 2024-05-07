import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsModalsFeedbackModalComponent } from './ps-modals-feedback-modal.component';

describe('PsModalsFeedbackModalComponent', () => {
  let component: PsModalsFeedbackModalComponent;
  let fixture: ComponentFixture<PsModalsFeedbackModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsModalsFeedbackModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsModalsFeedbackModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
