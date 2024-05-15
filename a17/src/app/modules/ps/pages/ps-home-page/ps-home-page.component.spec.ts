import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PsHomePageComponent } from './ps-home-page.component';

describe('PsHomePageComponent', () => {
  let component: PsHomePageComponent;
  let fixture: ComponentFixture<PsHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PsHomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PsHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
