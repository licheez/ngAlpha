import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsButtonsPageComponent } from './ps-buttons-page.component';

describe('PsButtonsPageComponent', () => {
  let component: PsButtonsPageComponent;
  let fixture: ComponentFixture<PsButtonsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsButtonsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsButtonsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
