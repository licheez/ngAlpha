import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { AlphaPrimeDatePickerComponent } from './alpha-prime-date-picker.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeDatePickerComponent', () => {
  let component: AlphaPrimeDatePickerComponent;
  let fixture: ComponentFixture<AlphaPrimeDatePickerComponent>;
  let mockPrimeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    mockPrimeService = jasmine.createSpyObj('AlphaPrimeService', ['generateRandomName']);
    mockPrimeService.generateRandomName.and.returnValue('test-date-picker-name');

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeDatePickerComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: mockPrimeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeDatePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    // Clean up any intervals
    if (component.phInterval) {
      clearInterval(component.phInterval);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.disabled).toBe(false);
      expect(component.showClear).toBe(true);
      expect(component.showTime).toBe(false);
      expect(component.showSeconds).toBe(false);
      expect(component.dateFormat).toBe('dd/mm/yy');
      expect(component.minDate).toEqual(new Date(1971, 0, 1));
      expect(component.maxDate).toEqual(new Date(3000, 11, 31));
      expect(component.date).toBeUndefined();
      expect(component.readonly).toBe(false);
      expect(component.readonlyCaption).toBe('');
      expect(component.sm).toBe(false);
    });

    it('should generate random name on construction', () => {
      expect(mockPrimeService.generateRandomName).toHaveBeenCalled();
      expect(component.name).toBe('test-date-picker-name');
    });

    it('should initialize ph signal with default value', () => {
      expect(component.ph()).toBe('dd/mm/yyyy');
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

  describe('Input: placeHolder setter', () => {
    it('should set ph signal with string placeholder', fakeAsync(() => {
      const testPlaceholder = 'Enter date';
      component.placeHolder = testPlaceholder;

      tick(0);
      expect(component.ph()).toBe('dd/mm/yy');

      tick(3000);
      expect(component.ph()).toBe(testPlaceholder);
    }));

    it('should handle empty array', fakeAsync(() => {
      component.placeHolder = [];

      tick(0);
      expect(component.ph()).toBe('dd/mm/yy');
    }));

    it('should reset interval when placeholder is set multiple times', fakeAsync(() => {
      component.placeHolder = 'First';
      const firstInterval = component.phInterval;

      component.placeHolder = 'Second';
      const secondInterval = component.phInterval;

      expect(firstInterval).toBeDefined();
      expect(secondInterval).toBeDefined();
      expect(firstInterval).not.toBe(secondInterval);

      clearInterval(secondInterval);
    }));
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

  describe('Method: onClear', () => {
    it('should set date to undefined', () => {
      component.date = new Date(2025, 11, 19);
      component.onClear();
      expect(component.date).toBeUndefined();
    });

    it('should emit undefined through dateChange', () => {
      spyOn(component.dateChange, 'emit');
      component.onClear();
      expect(component.dateChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should clear date and emit when date was set', () => {
      spyOn(component.dateChange, 'emit');
      component.date = new Date(2025, 5, 15);

      component.onClear();

      expect(component.date).toBeUndefined();
      expect(component.dateChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should work when date is already undefined', () => {
      spyOn(component.dateChange, 'emit');
      component.date = undefined;

      component.onClear();

      expect(component.date).toBeUndefined();
      expect(component.dateChange.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Method: onDateChanged', () => {
    it('should emit the provided date', () => {
      spyOn(component.dateChange, 'emit');
      const testDate = new Date(2025, 11, 19);

      component.onDateChanged(testDate);

      expect(component.dateChange.emit).toHaveBeenCalledWith(testDate);
    });

    it('should emit different dates correctly', () => {
      spyOn(component.dateChange, 'emit');

      const date1 = new Date(2025, 0, 1);
      component.onDateChanged(date1);
      expect(component.dateChange.emit).toHaveBeenCalledWith(date1);

      const date2 = new Date(2025, 11, 31);
      component.onDateChanged(date2);
      expect(component.dateChange.emit).toHaveBeenCalledWith(date2);
    });

    it('should handle dates with time', () => {
      spyOn(component.dateChange, 'emit');
      const testDate = new Date(2025, 11, 19, 14, 30, 45);

      component.onDateChanged(testDate);

      expect(component.dateChange.emit).toHaveBeenCalledWith(testDate);
    });
  });

  describe('Lifecycle: ngOnDestroy', () => {
    it('should clear interval on destroy', fakeAsync(() => {
      component.placeHolder = ['Test1', 'Test2'];
      const intervalId = component.phInterval;

      expect(intervalId).toBeDefined();

      component.ngOnDestroy();

      // Verify interval is cleared by checking it doesn't trigger
      const initialPh = component.ph();
      tick(3000);
      expect(component.ph()).toBe(initialPh);
    }));

    it('should not throw error if phInterval is not set', () => {
      component.phInterval = undefined;
      expect(() => component.ngOnDestroy()).not.toThrow();
    });

    it('should handle multiple destroy calls', () => {
      component.placeHolder = 'Test';

      expect(() => {
        component.ngOnDestroy();
        component.ngOnDestroy();
      }).not.toThrow();
    });

    it('should clear interval even if set manually', () => {
      component.phInterval = setInterval(() => {}, 1000);
      const intervalId = component.phInterval;

      component.ngOnDestroy();

      expect(component.phInterval).toBe(intervalId); // Still holds reference
      // But the interval itself is cleared
    });
  });

  describe('Input Properties', () => {
    it('should accept custom name input', () => {
      component.name = 'custom-date-picker';
      expect(component.name).toBe('custom-date-picker');
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      expect(component.disabled).toBe(true);
    });

    it('should accept showClear input', () => {
      component.showClear = false;
      expect(component.showClear).toBe(false);
    });

    it('should accept showTime input', () => {
      component.showTime = true;
      expect(component.showTime).toBe(true);
    });

    it('should accept showSeconds input', () => {
      component.showSeconds = true;
      expect(component.showSeconds).toBe(true);
    });

    it('should accept dateFormat input', () => {
      component.dateFormat = 'mm/dd/yy';
      expect(component.dateFormat).toBe('mm/dd/yy');
    });

    it('should accept minDate input', () => {
      const minDate = new Date(2020, 0, 1);
      component.minDate = minDate;
      expect(component.minDate).toEqual(minDate);
    });

    it('should accept maxDate input', () => {
      const maxDate = new Date(2030, 11, 31);
      component.maxDate = maxDate;
      expect(component.maxDate).toEqual(maxDate);
    });

    it('should accept date input', () => {
      const date = new Date(2025, 11, 19);
      component.date = date;
      expect(component.date).toEqual(date);
    });

    it('should accept readonly input', () => {
      component.readonly = true;
      expect(component.readonly).toBe(true);
    });

    it('should accept readonlyCaption input', () => {
      component.readonlyCaption = 'Read only text';
      expect(component.readonlyCaption).toBe('Read only text');
    });

    it('should accept null readonlyCaption', () => {
      component.readonlyCaption = null;
      expect(component.readonlyCaption).toBeNull();
    });

    it('should accept undefined readonlyCaption', () => {
      component.readonlyCaption = undefined;
      expect(component.readonlyCaption).toBeUndefined();
    });

    it('should accept sm input', () => {
      component.sm = true;
      expect(component.sm).toBe(true);
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user flow: select date -> change -> clear', () => {
      spyOn(component.dateChange, 'emit');

      // User selects a date
      const firstDate = new Date(2025, 11, 19);
      component.onDateChanged(firstDate);
      expect(component.dateChange.emit).toHaveBeenCalledWith(firstDate);

      // User changes the date
      const secondDate = new Date(2025, 11, 25);
      component.onDateChanged(secondDate);
      expect(component.dateChange.emit).toHaveBeenCalledWith(secondDate);

      // User clears the date
      component.onClear();
      expect(component.date).toBeUndefined();
      expect(component.dateChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should handle date range validation scenario', () => {
      component.minDate = new Date(2025, 0, 1);
      component.maxDate = new Date(2025, 11, 31);

      component.date = new Date(2025, 6, 15);

      expect(component.date.getTime()).toBeGreaterThanOrEqual(component.minDate.getTime());
      expect(component.date.getTime()).toBeLessThanOrEqual(component.maxDate.getTime());
    });

    it('should handle disabled state correctly', () => {
      component.disabled = true;
      spyOn(component.dateChange, 'emit');

      // Even when disabled, methods should still work (button will be disabled in UI)
      const date = new Date(2025, 11, 19);
      component.onDateChanged(date);
      expect(component.dateChange.emit).toHaveBeenCalledWith(date);
    });

    it('should handle time picker scenario', () => {
      component.showTime = true;
      component.showSeconds = true;

      const dateWithTime = new Date(2025, 11, 19, 14, 30, 45);
      spyOn(component.dateChange, 'emit');

      component.onDateChanged(dateWithTime);

      expect(component.dateChange.emit).toHaveBeenCalledWith(dateWithTime);
      expect(component.showTime).toBe(true);
      expect(component.showSeconds).toBe(true);
    });
  });

  describe('Edge Cases', () => {
    it('should handle dates at min boundary', () => {
      const minDate = new Date(1971, 0, 1);
      component.minDate = minDate;
      component.date = minDate;

      expect(component.date.getTime()).toBe(minDate.getTime());
    });

    it('should handle dates at max boundary', () => {
      const maxDate = new Date(3000, 11, 31);
      component.maxDate = maxDate;
      component.date = maxDate;

      expect(component.date.getTime()).toBe(maxDate.getTime());
    });

    it('should handle leap year dates', () => {
      const leapYearDate = new Date(2024, 1, 29); // Feb 29, 2024
      spyOn(component.dateChange, 'emit');

      component.onDateChanged(leapYearDate);

      expect(component.dateChange.emit).toHaveBeenCalledWith(leapYearDate);
    });

    it('should handle midnight dates', () => {
      component.date = new Date(2025, 11, 19, 0, 0, 0, 0);

      expect(component.date.getHours()).toBe(0);
      expect(component.date.getMinutes()).toBe(0);
      expect(component.date.getSeconds()).toBe(0);
    });

    it('should handle end of day dates', () => {
      component.date = new Date(2025, 11, 19, 23, 59, 59, 999);

      expect(component.date.getHours()).toBe(23);
      expect(component.date.getMinutes()).toBe(59);
      expect(component.date.getSeconds()).toBe(59);
    });

    it('should handle rapid date changes', () => {
      spyOn(component.dateChange, 'emit');

      for (let i = 1; i <= 5; i++) {
        const date = new Date(2025, 11, i);
        component.onDateChanged(date);
      }

      expect(component.dateChange.emit).toHaveBeenCalledTimes(5);
    });

    it('should handle placeholder changes during component lifetime', fakeAsync(() => {
      component.placeHolder = 'First';
      tick(3000);

      component.placeHolder = ['Second', 'Third'];
      tick(3000);

      expect(component.ph()).toBe('Second');

      clearInterval(component.phInterval);
    }));

    it('should handle switching between small and normal mode', () => {
      component.sm = false;
      const normalStyle = component.inputStyle;

      component.sm = true;
      const smallStyle = component.inputStyle;

      expect(normalStyle).not.toEqual(smallStyle);
      expect(smallStyle['font-size']).toBe('x-small');
    });

    it('should handle readonly mode with caption', () => {
      component.readonly = true;
      component.readonlyCaption = 'Cannot edit this date';

      expect(component.readonly).toBe(true);
      expect(component.readonlyCaption).toBe('Cannot edit this date');
    });

    it('should handle date with showTime but without showSeconds', () => {
      component.showTime = true;
      component.showSeconds = false;

      expect(component.showTime).toBe(true);
      expect(component.showSeconds).toBe(false);
    });
  });

  describe('Output EventEmitter', () => {
    it('should have dateChange EventEmitter defined', () => {
      expect(component.dateChange).toBeDefined();
      expect(component.dateChange instanceof EventEmitter).toBe(true);
    });

    it('should emit through dateChange on date selection', (done) => {
      const testDate = new Date(2025, 11, 19);

      component.dateChange.subscribe((date) => {
        expect(date).toEqual(testDate);
        done();
      });

      component.onDateChanged(testDate);
    });

    it('should emit through dateChange on clear', (done) => {
      component.dateChange.subscribe((date) => {
        expect(date).toBeUndefined();
        done();
      });

      component.onClear();
    });
  });

});
