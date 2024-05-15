import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmsPageComponent } from './ems-page.component';

describe('EmsPageComponent', () => {
  let component: EmsPageComponent;
  let fixture: ComponentFixture<EmsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmsPageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EmsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
