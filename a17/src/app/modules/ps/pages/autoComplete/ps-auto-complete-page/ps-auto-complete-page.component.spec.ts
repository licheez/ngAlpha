import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsAutoCompletePageComponent } from './ps-auto-complete-page.component';

describe('PsAutoCompletePageComponent', () => {
  let component: PsAutoCompletePageComponent;
  let fixture: ComponentFixture<PsAutoCompletePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsAutoCompletePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsAutoCompletePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
