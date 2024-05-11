import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaLbsComponent } from './alpha-lbs.component';

describe('AlphaLbsComponent', () => {
  let component: AlphaLbsComponent;
  let fixture: ComponentFixture<AlphaLbsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AlphaLbsComponent]
    });
    fixture = TestBed.createComponent(AlphaLbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
