import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsModalsPageComponent } from './ps-modals-page.component';

describe('PsModalsPageComponent', () => {
  let component: PsModalsPageComponent;
  let fixture: ComponentFixture<PsModalsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsModalsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsModalsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
