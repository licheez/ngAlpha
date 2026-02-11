import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeDateRangePickerComponent } from './alpha-prime-date-range-picker.component';

describe('AlphaPrimeDateRangePicker', () => {
  let component: AlphaPrimeDateRangePickerComponent;
  let fixture: ComponentFixture<AlphaPrimeDateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeDateRangePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeDateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
