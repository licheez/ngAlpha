import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaLbsComponent } from './alpha-lbs.component';

describe('AlphaLbsComponent', () => {
  let component: AlphaLbsComponent;
  let fixture: ComponentFixture<AlphaLbsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaLbsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaLbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
