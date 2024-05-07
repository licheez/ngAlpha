import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ComHomePageComponent } from './com-home-page.component';

describe('ComHomePageComponent', () => {
  let component: ComHomePageComponent;
  let fixture: ComponentFixture<ComHomePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ComHomePageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ComHomePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
