import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaPrimeDateRangePickerComponent } from './alpha-prime-date-range-picker.component';
import spyOn = jest.spyOn;

describe('AlphaPrimeDateRangePickerComponent', () => {
  let component: AlphaPrimeDateRangePickerComponent;
  let fixture: ComponentFixture<AlphaPrimeDateRangePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeDateRangePickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeDateRangePickerComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('inputStyle', () => {
    it('should return baseInputStyle when sm is false', () => {
      component.sm = false;
      expect(component.inputStyle).toEqual(component.baseInputStyle);
    });

    it('should return smInputStyle when sm is true', () => {
      component.sm = true;
      expect(component.inputStyle).toEqual(component.smInputStyle);
    });
  });

  describe('onSelection', () => {
    it('should select the start date', () => {
      spyOn(component.startDateChange, 'emit');
      spyOn(component.endDateChange, 'emit');
      const startDate = new Date();
      component.onSelection([startDate]);
      expect(component.startDate).toEqual(startDate);
      expect(component.endDate).toBeUndefined();
      expect(component.startDateChange.emit)
        .toHaveBeenCalledWith(startDate);
      expect(component.endDateChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it('should select both the start and the end dates', () => {
      spyOn(component.startDateChange, 'emit');
      spyOn(component.endDateChange, 'emit');
      const startDate = new Date(2024,0,1);
      const endDate = new Date(2024, 0, 2);
      component.onSelection([startDate, endDate]);
      expect(component.startDate).toEqual(startDate);
      expect(component.endDate).toEqual(endDate);
      expect(component.startDateChange.emit)
        .toHaveBeenCalledWith(startDate);
      expect(component.endDateChange.emit)
        .toHaveBeenCalledWith(endDate);
    });
  });

  describe('onClear', () => {
    it('should handle onClear', () => {
      spyOn(component.startDateChange, 'emit');
      spyOn(component.endDateChange, 'emit');
      component.startDate = new Date();
      component.endDate = new Date();
      component.onClear();
      expect(component.dateRange).toBeUndefined();
      expect(component.startDate).toBeUndefined();
      expect(component.endDate).toBeUndefined();
      expect(component.startDateChange.emit)
        .toHaveBeenCalledWith(undefined);
      expect(component.endDateChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
  });
});
