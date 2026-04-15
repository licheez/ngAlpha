import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaPrimeCurrencyInputComponent } from './alpha-prime-currency-input.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeCurrencyInputComponent', () => {
  let component: AlphaPrimeCurrencyInputComponent;
  let fixture: ComponentFixture<AlphaPrimeCurrencyInputComponent>;
  let mockPrimeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    mockPrimeService = jasmine.createSpyObj('AlphaPrimeService', ['generateRandomName']);
    mockPrimeService.generateRandomName.and.returnValue('test-name');

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeCurrencyInputComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: mockPrimeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeCurrencyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.disabled).toBe(false);
      expect(component.placeHolder).toBe('');
      expect(component.min).toBe(-Number.MAX_VALUE);
      expect(component.max).toBe(Number.MAX_VALUE);
      expect(component.currency).toBe('EUR');
      expect(component.currencySymbol).toBe('€');
      expect(component.locale).toBe('fr-BE');
      expect(component.readonly).toBe(false);
      expect(component.readonlyCaption).toBe('');
      expect(component.sm).toBe(false);
      expect(component.showClear).toBe(true);
      expect(component.invalid).toBe(false);
    });

    it('should generate random name on construction', () => {
      expect(mockPrimeService.generateRandomName).toHaveBeenCalled();
      expect(component.name).toBe('test-name');
    });

    it('should have correct realNumber regex pattern', () => {
      expect(component.realNumber).toEqual(/[0-9\,\.\-]/);
    });
  });

  describe('Input: value', () => {
    it('should set sVal to undefined when value is undefined', () => {
      component.value = undefined;
      expect(component.sVal).toBeUndefined();
    });

    it('should set sVal to "0" when value is 0', () => {
      component.value = 0;
      expect(component.sVal).toBe('0');
    });

    it('should set sVal to string representation of positive number', () => {
      component.value = 123.45;
      expect(component.sVal).toBe('123.45');
    });

    it('should set sVal to string representation of negative number', () => {
      component.value = -67.89;
      expect(component.sVal).toBe('-67.89');
    });
  });

  describe('Getter: value', () => {
    it('should return undefined when sVal is undefined', () => {
      component.sVal = undefined;
      expect(component.value).toBeUndefined();
    });

    it('should return undefined when sVal is empty string', () => {
      component.sVal = '';
      expect(component.value).toBeUndefined();
    });

    it('should return number when sVal is valid number string', () => {
      component.sVal = '123.45';
      expect(component.value).toBe(123.45);
    });

    it('should return 0 when sVal is "0"', () => {
      component.sVal = '0';
      expect(component.value).toBe(0);
    });

    it('should return undefined when sVal is NaN', () => {
      component.sVal = 'invalid';
      expect(component.value).toBeUndefined();
    });

    it('should handle negative numbers', () => {
      component.sVal = '-99.99';
      expect(component.value).toBe(-99.99);
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

  describe('Method: onTextChange', () => {
    it('should call onClear when sVal is undefined', () => {
      spyOn(component, 'onClear');
      component.onTextChange(undefined);
      expect(component.onClear).toHaveBeenCalled();
    });

    it('should call onClear when sVal is empty string', () => {
      spyOn(component, 'onClear');
      component.onTextChange('');
      expect(component.onClear).toHaveBeenCalled();
    });

    it('should replace comma with dot', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('123,45');
      expect(component.sVal).toBe('123.45');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(123.45);
    });

    it('should handle multiple commas', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('1,234,567');
      expect(component.sVal).toBe('1.234.567');
    });

    it('should handle "-0" as valid input', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('-0');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should handle "-." as valid input', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('-.');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should handle "-0." as valid input', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('-0.');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should emit valid number when input is valid', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('99.99');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(99.99);
    });

    it('should set invalid to true when value is NaN', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('abc');
      expect(component.invalid).toBe(true);
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should set invalid to true when value is less than min', () => {
      spyOn(component.valueChange, 'emit');
      component.min = 0;
      component.onTextChange('-10');
      expect(component.invalid).toBe(true);
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should set invalid to true when value is greater than max', () => {
      spyOn(component.valueChange, 'emit');
      component.max = 100;
      component.onTextChange('200');
      expect(component.invalid).toBe(true);
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should accept value equal to min', () => {
      spyOn(component.valueChange, 'emit');
      component.min = 10;
      component.onTextChange('10');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(10);
    });

    it('should accept value equal to max', () => {
      spyOn(component.valueChange, 'emit');
      component.max = 100;
      component.onTextChange('100');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(100);
    });

    it('should handle negative numbers correctly', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('-50.25');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(-50.25);
    });

    it('should convert number input to string', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange(42);
      expect(component.sVal).toBe('42');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(42);
    });

    it('should handle zero value', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('0');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(0);
    });

    it('should handle decimal numbers with leading zero', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('0.5');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(0.5);
    });
  });

  describe('Method: onClear', () => {
    it('should reset invalid to false', () => {
      component.invalid = true;
      component.onClear();
      expect(component.invalid).toBe(false);
    });

    it('should set sVal to undefined', () => {
      component.sVal = '123.45';
      component.onClear();
      expect(component.sVal).toBeUndefined();
    });

    it('should emit undefined', () => {
      spyOn(component.valueChange, 'emit');
      component.onClear();
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should reset all state when called', () => {
      spyOn(component.valueChange, 'emit');
      component.invalid = true;
      component.sVal = '999';

      component.onClear();

      expect(component.invalid).toBe(false);
      expect(component.sVal).toBeUndefined();
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('Method: onBlur', () => {
    it('should format value to 2 decimal places when value exists', () => {
      component.sVal = '123.4567';
      component.onBlur();
      expect(component.sVal).toBe('123.46');
    });

    it('should round up correctly', () => {
      component.sVal = '10.999';
      component.onBlur();
      expect(component.sVal).toBe('11.00');
    });

    it('should round down correctly', () => {
      component.sVal = '10.001';
      component.onBlur();
      expect(component.sVal).toBe('10.00');
    });

    it('should not change sVal when value is undefined', () => {
      component.sVal = undefined;
      component.onBlur();
      expect(component.sVal).toBeUndefined();
    });

    it('should not change sVal when value is 0', () => {
      component.sVal = '0';
      component.onBlur();
      expect(component.sVal).toBe('0');
    });

    it('should handle negative numbers', () => {
      component.sVal = '-50.256';
      component.onBlur();
      expect(component.sVal).toBe('-50.26');
    });

    it('should not format when sVal is invalid', () => {
      component.sVal = 'abc';
      component.onBlur();
      expect(component.sVal).toBe('abc');
    });

    it('should add trailing zeros when needed', () => {
      component.sVal = '100';
      component.onBlur();
      expect(component.sVal).toBe('100.00');
    });

    it('should format single decimal place to two places', () => {
      component.sVal = '25.5';
      component.onBlur();
      expect(component.sVal).toBe('25.50');
    });
  });

  describe('Integration Tests', () => {
    it('should handle complete user flow: input -> validate -> blur -> clear', () => {
      spyOn(component.valueChange, 'emit');

      // User types a value
      component.onTextChange('123.456');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(123.456);

      // User blurs the field
      component.onBlur();
      expect(component.sVal).toBe('123.46');

      // User clears the field
      component.onClear();
      expect(component.sVal).toBeUndefined();
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(undefined);
    });

    it('should handle invalid input followed by valid input', () => {
      spyOn(component.valueChange, 'emit');

      // Invalid input
      component.onTextChange('abc');
      expect(component.invalid).toBe(true);

      // Valid input
      component.onTextChange('50');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(50);
    });

    it('should handle value outside range followed by value inside range', () => {
      spyOn(component.valueChange, 'emit');
      component.min = 0;
      component.max = 100;

      // Outside range
      component.onTextChange('200');
      expect(component.invalid).toBe(true);

      // Inside range
      component.onTextChange('50');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(50);
    });

    it('should handle comma replacement in real-world scenario', () => {
      spyOn(component.valueChange, 'emit');

      // User types with comma (common in European locales)
      component.onTextChange('1234,56');
      expect(component.sVal).toBe('1234.56');
      expect(component.valueChange.emit).toHaveBeenCalledWith(1234.56);

      // Blur formats it
      component.onBlur();
      expect(component.sVal).toBe('1234.56');
    });
  });

  describe('Edge Cases', () => {
    it('should handle very large numbers', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('999999999.99');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(999999999.99);
    });

    it('should handle very small decimal numbers', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('0.01');
      expect(component.invalid).toBe(false);
      expect(component.valueChange.emit).toHaveBeenCalledWith(0.01);
    });

    it('should handle numbers with many decimal places', () => {
      component.sVal = '3.141592653589793';
      component.onBlur();
      expect(component.sVal).toBe('3.14');
    });

    it('should handle value set programmatically followed by user input', () => {
      spyOn(component.valueChange, 'emit');

      // Programmatic set
      component.value = 100;
      expect(component.sVal).toBe('100');

      // User changes it
      component.onTextChange('200');
      expect(component.valueChange.emit).toHaveBeenCalledWith(200);
    });

    it('should handle rapid consecutive changes', () => {
      spyOn(component.valueChange, 'emit');

      component.onTextChange('1');
      component.onTextChange('12');
      component.onTextChange('123');
      component.onTextChange('123.');
      component.onTextChange('123.4');
      component.onTextChange('123.45');

      expect(component.valueChange.emit).toHaveBeenCalledTimes(6);
      expect(component.sVal).toBe('123.45');
      expect(component.invalid).toBe(false);
    });

    it('should handle empty string after having a value', () => {
      spyOn(component, 'onClear');
      component.sVal = '100';
      component.onTextChange('');
      expect(component.onClear).toHaveBeenCalled();
    });
  });

  describe('Input Properties', () => {
    it('should accept custom name input', () => {
      component.name = 'custom-name';
      expect(component.name).toBe('custom-name');
    });

    it('should accept disabled input', () => {
      component.disabled = true;
      expect(component.disabled).toBe(true);
    });

    it('should accept placeHolder input', () => {
      component.placeHolder = 'Enter amount';
      expect(component.placeHolder).toBe('Enter amount');
    });

    it('should accept min input', () => {
      component.min = 0;
      expect(component.min).toBe(0);
    });

    it('should accept max input', () => {
      component.max = 1000;
      expect(component.max).toBe(1000);
    });

    it('should accept currency input', () => {
      component.currency = 'USD';
      expect(component.currency).toBe('USD');
    });

    it('should accept currencySymbol input', () => {
      component.currencySymbol = '$';
      expect(component.currencySymbol).toBe('$');
    });

    it('should accept locale input', () => {
      component.locale = 'en-US';
      expect(component.locale).toBe('en-US');
    });

    it('should accept readonly input', () => {
      component.readonly = true;
      expect(component.readonly).toBe(true);
    });

    it('should accept readonlyCaption input', () => {
      component.readonlyCaption = 'Read only text';
      expect(component.readonlyCaption).toBe('Read only text');
    });

    it('should accept sm input', () => {
      component.sm = true;
      expect(component.sm).toBe(true);
    });

    it('should accept showClear input', () => {
      component.showClear = false;
      expect(component.showClear).toBe(false);
    });
  });
});
