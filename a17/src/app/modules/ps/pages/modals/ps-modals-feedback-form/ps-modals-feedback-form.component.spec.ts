import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsModalsFeedbackFormComponent } from './ps-modals-feedback-form.component';

describe('PsModalsFeedbackFormComponent', () => {
  let component: PsModalsFeedbackFormComponent;
  let fixture: ComponentFixture<PsModalsFeedbackFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsModalsFeedbackFormComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsModalsFeedbackFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
