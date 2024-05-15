import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsScrollerPageComponent } from './ps-scroller-page.component';

describe('PsScrollerPageComponent', () => {
  let component: PsScrollerPageComponent;
  let fixture: ComponentFixture<PsScrollerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsScrollerPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsScrollerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
