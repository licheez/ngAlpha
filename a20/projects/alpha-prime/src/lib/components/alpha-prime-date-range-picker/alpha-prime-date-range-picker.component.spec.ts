import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { AlphaPrimeDateRangePickerComponent } from './alpha-prime-date-range-picker.component';

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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.disabled).toBe(false);
      expect(component.displayMonths).toBe(1);
      expect(component.dateFormat).toBe('dd M yy');
      expect(component.placeHolder).toBe('');
      expect(component.readonly).toBe(false);
      expect(component.readonlyCaption).toBe('');
      expect(component.sm).toBe(false);
      expect(component.minDate).toEqual(new Date(1971, 0, 1));
      expect(component.maxDate).toEqual(new Date(3000, 11, 31));
      expect(component.startDate).toBeUndefined();
      expect(component.endDate).toBeUndefined();
      expect(component.dateRange).toBeUndefined();
    });

    it('should have correct baseInputStyle properties', () => {
      expect(component.baseInputStyle).toEqual({
        'width': '100%',
        'border-top-right-radius': '0',
        'border-bottom-right-radius': '0'
      });
    });

    it('should have correct smInputStyle properties', () => {
      expect(component.smInputStyle).toEqual({
        'width': '100%',
        'border-top-right-radius': '0',
        'border-bottom-right-radius': '0',
        'font-size': 'x-small'
      });
    });
  });

  describe('Getter: inputStyle', () => {
    it('should return baseInputStyle when sm is false', () => {
      component.sm = false;
      expect(component.inputStyle).toEqual(component.baseInputStyle);
    });

    it('should return smInputStyle when sm is true', () => {
      component.sm = true;
      expect(component.inputStyle).toEqual(component.smInputStyle);
    });

    it('should react to sm changes', () => {
      component.sm = false;
      expect(component.inputStyle).toEqual(component.baseInputStyle);

      component.sm = true;
      expect(component.inputStyle).toEqual(component.smInputStyle);

      component.sm = false;
      expect(component.inputStyle).toEqual(component.baseInputStyle);
    });
  });

  describe('Method: onSelection', () => {
    it('should set startDate and endDate from date range', () => {
      const startDate = new Date(2025, 0, 1);
      const endDate = new Date(2025, 0, 15);
      const dateRange = [startDate, endDate];

      component.onSelection(dateRange);

      expect(component.startDate).toBe(startDate);
      expect(component.endDate).toBe(endDate);
    });

    it('should emit startDateChange and endDateChange events', () => {
      spyOn(component.startDateChange, 'emit');
      spyOn(component.endDateChange, 'emit');

      const startDate = new Date(2025, 0, 1);
      const endDate = new Date(2025, 0, 15);
      const dateRange = [startDate, endDate];

      component.onSelection(dateRange);

      expect(component.startDateChange.emit).toHaveBeenCalledWith(startDate);
      expect(component.endDateChange.emit).toHaveBeenCalledWith(endDate);
    });

    it('should handle incomplete date range with only start date', () => {
      const startDate = new Date(2025, 0, 1);
      const dateRange = [startDate, null as any];

      component.onSelection(dateRange);

      expect(component.startDate).toBe(startDate);
      expect(component.endDate).toBeUndefined();
    });

    it('should emit undefined for endDate when only start date is selected', () => {
      spyOn(component.startDateChange, 'emit');
      spyOn(component.endDateChange, 'emit');

      const startDate = new Date(2025, 0, 1);
      const dateRange = [startDate, null as any];

      component.onSelection(dateRange);

      expect(component.startDateChange.emit).toHaveBeenCalledWith(startDate);
      expect(component.endDateChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should handle different date ranges', () => {
      spyOn(component.startDateChange, 'emit');
      spyOn(component.endDateChange, 'emit');

      // First selection
      const start1 = new Date(2025, 0, 1);
      const end1 = new Date(2025, 0, 15);
      component.onSelection([start1, end1]);

      expect(component.startDate).toBe(start1);
      expect(component.endDate).toBe(end1);
      expect(component.startDateChange.emit).toHaveBeenCalledWith(start1);
      expect(component.endDateChange.emit).toHaveBeenCalledWith(end1);

      // Second selection
      const start2 = new Date(2025, 5, 1);
      const end2 = new Date(2025, 5, 30);
      component.onSelection([start2, end2]);

      expect(component.startDate).toBe(start2);
      expect(component.endDate).toBe(end2);
      expect(component.startDateChange.emit).toHaveBeenCalledWith(start2);
      expect(component.endDateChange.emit).toHaveBeenCalledWith(end2);
    });
  });

  describe('Method: onClear', () => {
    it('should clear all date values', () => {
      component.dateRange = [new Date(2025, 0, 1), new Date(2025, 0, 15)];
      component.startDate = new Date(2025, 0, 1);
      component.endDate = new Date(2025, 0, 15);

      component.onClear();

      expect(component.dateRange).toBeUndefined();
      expect(component.startDate).toBeUndefined();
      expect(component.endDate).toBeUndefined();
    });

    it('should emit undefined for both date change events', () => {
      spyOn(component.startDateChange, 'emit');
      spyOn(component.endDateChange, 'emit');

      component.dateRange = [new Date(2025, 0, 1), new Date(2025, 0, 15)];
      component.startDate = new Date(2025, 0, 1);
      component.endDate = new Date(2025, 0, 15);

      component.onClear();

      expect(component.startDateChange.emit).toHaveBeenCalledWith(undefined);
      expect(component.endDateChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should work when dates are already undefined', () => {
      spyOn(component.startDateChange, 'emit');
      spyOn(component.endDateChange, 'emit');

      component.dateRange = undefined;
      component.startDate = undefined;
      component.endDate = undefined;

      component.onClear();

      expect(component.dateRange).toBeUndefined();
      expect(component.startDate).toBeUndefined();
      expect(component.endDate).toBeUndefined();
      expect(component.startDateChange.emit).toHaveBeenCalledWith(undefined);
      expect(component.endDateChange.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Input Properties', () => {
    it('should accept and update disabled property', () => {
      component.disabled = true;
      expect(component.disabled).toBe(true);

      component.disabled = false;
      expect(component.disabled).toBe(false);
    });

    it('should accept and update displayMonths property', () => {
      component.displayMonths = 2;
      expect(component.displayMonths).toBe(2);

      component.displayMonths = 3;
      expect(component.displayMonths).toBe(3);
    });

    it('should accept and update dateFormat property', () => {
      component.dateFormat = 'mm/dd/yy';
      expect(component.dateFormat).toBe('mm/dd/yy');
    });

    it('should accept and update placeHolder property', () => {
      component.placeHolder = 'Select date range';
      expect(component.placeHolder).toBe('Select date range');
    });

    it('should accept and update readonly property', () => {
      component.readonly = true;
      expect(component.readonly).toBe(true);
    });

    it('should accept and update readonlyCaption property', () => {
      component.readonlyCaption = '2025-01-01 to 2025-01-15';
      expect(component.readonlyCaption).toBe('2025-01-01 to 2025-01-15');
    });

    it('should accept and update minDate property', () => {
      const testDate = new Date(2020, 0, 1);
      component.minDate = testDate;
      expect(component.minDate).toBe(testDate);
    });

    it('should accept and update maxDate property', () => {
      const testDate = new Date(2030, 11, 31);
      component.maxDate = testDate;
      expect(component.maxDate).toBe(testDate);
    });
  });

  describe('Output Properties', () => {
    it('should have startDateChange EventEmitter', () => {
      expect(component.startDateChange).toBeInstanceOf(EventEmitter);
    });

    it('should have endDateChange EventEmitter', () => {
      expect(component.endDateChange).toBeInstanceOf(EventEmitter);
    });
  });
});
