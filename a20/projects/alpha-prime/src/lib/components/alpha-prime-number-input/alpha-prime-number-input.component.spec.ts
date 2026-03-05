import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AlphaPrimeNumberInputComponent } from './alpha-prime-number-input.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeNumberInputComponent', () => {
  let component: AlphaPrimeNumberInputComponent;
  let fixture: ComponentFixture<AlphaPrimeNumberInputComponent>;
  let compiled: DebugElement;
  let primeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    const primeServiceSpy = jasmine.createSpyObj('AlphaPrimeService', [
      'generateRandomName'
    ]);
    primeServiceSpy.generateRandomName.and.returnValue('testInput_123');

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeNumberInputComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: primeServiceSpy }
      ]
    })
      .compileComponents();

    primeService = TestBed.inject(AlphaPrimeService) as jasmine.SpyObj<AlphaPrimeService>;
    fixture = TestBed.createComponent(AlphaPrimeNumberInputComponent);
    compiled = fixture.debugElement;
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Input Defaults', () => {
    it('should have default empty placeHolder', () => {
      fixture.detectChanges();
      expect(component.placeHolder()).toBe('');
    });

    it('should have default disabled as false', () => {
      fixture.detectChanges();
      expect(component.disabled()).toBe(false);
    });

    it('should have default prefix as empty string', () => {
      fixture.detectChanges();
      expect(component.prefix()).toBe('');
    });

    it('should have default suffix as empty string', () => {
      fixture.detectChanges();
      expect(component.suffix()).toBe('');
    });

    it('should have default decimals as 0', () => {
      fixture.detectChanges();
      expect(component.decimals()).toBe(0);
    });

    it('should have default min as -Number.MAX_VALUE', () => {
      fixture.detectChanges();
      expect(component.min()).toBe(-Number.MAX_VALUE);
    });

    it('should have default max as Number.MAX_VALUE', () => {
      fixture.detectChanges();
      expect(component.max()).toBe(Number.MAX_VALUE);
    });

    it('should have default locale as fr-BE', () => {
      fixture.detectChanges();
      expect(component.locale()).toBe('fr-BE');
    });

    it('should have default readonly as false', () => {
      fixture.detectChanges();
      expect(component.readonly()).toBe(false);
    });

    it('should have default readonlyCaption as empty string', () => {
      fixture.detectChanges();
      expect(component.readonlyCaption()).toBe('');
    });

    it('should have default sm as false', () => {
      fixture.detectChanges();
      expect(component.sm()).toBe(false);
    });

    it('should have default showClear as true', () => {
      fixture.detectChanges();
      expect(component.showClear()).toBe(true);
    });

    it('should have default value as undefined', () => {
      fixture.detectChanges();
      expect(component.value()).toBeUndefined();
    });

    it('should have default invalid as false', () => {
      fixture.detectChanges();
      expect(component.invalid()).toBe(false);
    });

    it('should have default sVal as undefined', () => {
      fixture.detectChanges();
      expect(component.sVal()).toBeUndefined();
    });

    it('should generate random name on init', () => {
      fixture.detectChanges();
      expect(primeService.generateRandomName).toHaveBeenCalled();
    });
  });

  describe('Input Value Sync via Effect', () => {
    it('should sync undefined value to sVal', () => {
      fixture.componentRef.setInput('value', undefined);
      fixture.detectChanges();
      expect(component.sVal()).toBeUndefined();
    });

    it('should sync zero value to sVal as "0"', () => {
      fixture.componentRef.setInput('value', 0);
      fixture.detectChanges();
      expect(component.sVal()).toBe('0');
    });

    it('should sync positive number to sVal as string', () => {
      fixture.componentRef.setInput('value', 42);
      fixture.detectChanges();
      expect(component.sVal()).toBe('42');
    });

    it('should sync negative number to sVal as string', () => {
      fixture.componentRef.setInput('value', -15);
      fixture.detectChanges();
      expect(component.sVal()).toBe('-15');
    });

    it('should sync decimal number to sVal as string', () => {
      fixture.componentRef.setInput('value', 3.14);
      fixture.detectChanges();
      expect(component.sVal()).toBe('3.14');
    });
  });

  describe('onTextChange', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should call onClear when value is empty', () => {
      spyOn(component, 'onClear');
      component.onTextChange('');
      expect(component.onClear).toHaveBeenCalled();
    });

    it('should call onClear when value is null', () => {
      spyOn(component, 'onClear');
      component.onTextChange(null as any);
      expect(component.onClear).toHaveBeenCalled();
    });

    it('should call onClear when value is undefined', () => {
      spyOn(component, 'onClear');
      component.onTextChange(undefined);
      expect(component.onClear).toHaveBeenCalled();
    });

    it('should replace comma with dot', () => {
      component.onTextChange('3,14');
      expect(component.sVal()).toBe('3.14');
    });

    it('should handle string input', () => {
      component.onTextChange('123');
      expect(component.sVal()).toBe('123');
    });

    it('should handle numeric input', () => {
      component.onTextChange(456);
      expect(component.sVal()).toBe('456');
    });

    it('should emit valid number on valueChange', (done) => {
      component.valueChange.subscribe((value) => {
        expect(value).toBe(42);
        done();
      });
      component.onTextChange('42');
    });

    it('should set invalid flag to false for valid number', () => {
      component.onTextChange('42');
      expect(component.invalid()).toBe(false);
    });

    it('should set invalid flag to true for invalid number', () => {
      component.onTextChange('abc');
      expect(component.invalid()).toBe(true);
    });

    it('should emit undefined for invalid number', (done) => {
      component.valueChange.subscribe((value) => {
        expect(value).toBeUndefined();
        done();
      });
      component.onTextChange('xyz');
    });

    it('should handle -0 special case', (done) => {
      component.valueChange.subscribe((value) => {
        expect(value).toBeUndefined();
        expect(component.invalid()).toBe(false);
        done();
      });
      component.onTextChange('-0');
    });

    it('should handle -. special case', (done) => {
      component.valueChange.subscribe((value) => {
        expect(value).toBeUndefined();
        expect(component.invalid()).toBe(false);
        done();
      });
      component.onTextChange('-.');
    });

    it('should handle -0. special case', (done) => {
      component.valueChange.subscribe((value) => {
        expect(value).toBeUndefined();
        expect(component.invalid()).toBe(false);
        done();
      });
      component.onTextChange('-0.');
    });

    it('should validate against min constraint', () => {
      fixture.componentRef.setInput('min', 10);
      fixture.detectChanges();
      component.onTextChange('5');
      expect(component.invalid()).toBe(true);
    });

    it('should validate against max constraint', () => {
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();
      component.onTextChange('150');
      expect(component.invalid()).toBe(true);
    });

    it('should accept number within min-max range', () => {
      fixture.componentRef.setInput('min', 0);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();
      component.onTextChange('50');
      expect(component.invalid()).toBe(false);
    });

    it('should accept minimum boundary value', () => {
      fixture.componentRef.setInput('min', 10);
      fixture.detectChanges();
      component.onTextChange('10');
      expect(component.invalid()).toBe(false);
    });

    it('should accept maximum boundary value', () => {
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();
      component.onTextChange('100');
      expect(component.invalid()).toBe(false);
    });
  });

  describe('onClear', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should set sVal to undefined', () => {
      component.sVal.set('123');
      component.onClear();
      expect(component.sVal()).toBeUndefined();
    });

    it('should set invalid to false', () => {
      component.invalid.set(true);
      component.onClear();
      expect(component.invalid()).toBe(false);
    });

    it('should emit undefined on valueChange', (done) => {
      component.valueChange.subscribe((value) => {
        expect(value).toBeUndefined();
        done();
      });
      component.onClear();
    });
  });

  describe('getNumericValue', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should return undefined when sVal is empty', () => {
      component.sVal.set(undefined);
      expect(component.getNumericValue()).toBeUndefined();
    });

    it('should return parsed number from sVal', () => {
      component.sVal.set('42');
      expect(component.getNumericValue()).toBe(42);
    });

    it('should return undefined for non-numeric sVal', () => {
      component.sVal.set('abc');
      expect(component.getNumericValue()).toBeUndefined();
    });

    it('should handle decimal conversion', () => {
      component.sVal.set('3.14');
      expect(component.getNumericValue()).toBe(3.14);
    });

    it('should handle negative number conversion', () => {
      component.sVal.set('-42');
      expect(component.getNumericValue()).toBe(-42);
    });
  });

  describe('isValidCharacter', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should accept digits', () => {
      expect(component.isValidCharacter('5')).toBe(true);
    });

    it('should accept comma', () => {
      expect(component.isValidCharacter(',')).toBe(true);
    });

    it('should accept dot', () => {
      expect(component.isValidCharacter('.')).toBe(true);
    });

    it('should accept minus', () => {
      expect(component.isValidCharacter('-')).toBe(true);
    });

    it('should reject letters', () => {
      expect(component.isValidCharacter('a')).toBe(false);
    });

    it('should reject special characters', () => {
      expect(component.isValidCharacter('#')).toBe(false);
    });

    it('should reject spaces', () => {
      expect(component.isValidCharacter(' ')).toBe(false);
    });
  });

  describe('inputStyle Computed', () => {
    it('should return baseInputStyle when sm is false', () => {
      fixture.componentRef.setInput('sm', false);
      fixture.detectChanges();
      const style = component.inputStyle();
      expect(style['width']).toBe('100%');
      expect(style['border-top-right-radius']).toBe('0');
      expect(style['border-bottom-right-radius']).toBe('0');
    });

    it('should return smInputStyle when sm is true', () => {
      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();
      const style = component.inputStyle();
      expect(style['width']).toBe('100%');
      expect(style['border-top-right-radius']).toBe('0');
      expect(style['border-bottom-right-radius']).toBe('0');
    });
  });

  describe('Template Rendering', () => {
    it('should render input element when not readonly', () => {
      fixture.componentRef.setInput('readonly', false);
      fixture.detectChanges();
      const input = compiled.query(By.css('input[type="text"]'));
      expect(input).toBeTruthy();
    });

    it('should render readonly input when readonly is true', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.componentRef.setInput('readonlyCaption', 'Read-only value');
      fixture.detectChanges();
      const readonlyInput = compiled.query(By.css('input[readonly]'));
      expect(readonlyInput).toBeTruthy();
    });

    it('should display readonlyCaption in readonly mode', () => {
      fixture.componentRef.setInput('readonly', true);
      fixture.componentRef.setInput('readonlyCaption', 'Readonly Text');
      fixture.detectChanges();
      const readonlyInput = compiled.query(By.css('input[readonly]'));
      expect(readonlyInput.nativeElement.value).toBe('Readonly Text');
    });

    it('should set placeholder attribute on input', () => {
      fixture.componentRef.setInput('placeHolder', 'Enter number');
      fixture.detectChanges();
      const input = compiled.query(By.css('input[type="text"]'));
      expect(input.nativeElement.placeholder).toBe('Enter number');
    });

    it('should apply invalid class when invalid is true', () => {
      fixture.detectChanges();
      component.invalid.set(true);
      fixture.detectChanges();
      const input = compiled.query(By.css('input.ng-invalid'));
      expect(input).toBeTruthy();
    });

    it('should not render clear button when value is undefined', () => {
      fixture.componentRef.setInput('readonly', false);
      fixture.componentRef.setInput('value', undefined);
      fixture.componentRef.setInput('showClear', true);
      fixture.detectChanges();
      const clearButton = compiled.query(By.css('p-button'));
      expect(clearButton).toBeFalsy();
    });

    it('should not render clear button when showClear is false', () => {
      fixture.componentRef.setInput('readonly', false);
      fixture.componentRef.setInput('value', 42);
      fixture.componentRef.setInput('showClear', false);
      fixture.detectChanges();
      const clearButton = compiled.query(By.css('p-button'));
      expect(clearButton).toBeFalsy();
    });

    it('should call onClear when clear button is clicked', () => {
      spyOn(component, 'onClear');
      fixture.componentRef.setInput('readonly', false);
      fixture.componentRef.setInput('value', 42);
      fixture.componentRef.setInput('showClear', true);
      fixture.detectChanges();
      const clearButton = compiled.query(By.css('p-button'));
      clearButton.nativeElement.click();
      fixture.detectChanges();
      expect(component.onClear).toHaveBeenCalled();
    });

    it('should use p-input-group for wrapping', () => {
      fixture.componentRef.setInput('readonly', false);
      fixture.detectChanges();
      const inputGroup = compiled.query(By.css('p-input-group'));
      expect(inputGroup).toBeTruthy();
    });
  });

  describe('Event Handling', () => {
    beforeEach(() => {
      fixture.detectChanges();
    });

    it('should emit valueChange when text changes to valid number', (done) => {
      component.valueChange.subscribe((value) => {
        expect(value).toBe(100);
        done();
      });
      const input = compiled.query(By.css('input[type="text"]'));
      input.nativeElement.value = '100';
      input.triggerEventHandler('ngModelChange', '100');
    });

    it('should update sVal on ngModelChange', () => {
      const input = compiled.query(By.css('input[type="text"]'));
      input.triggerEventHandler('ngModelChange', '42');
      expect(component.sVal()).toBe('42');
    });
  });

  describe('Locale Support', () => {
    it('should allow custom locale input', () => {
      fixture.componentRef.setInput('locale', 'en-US');
      fixture.detectChanges();
      expect(component.locale()).toBe('en-US');
    });

    it('should have default locale fr-BE', () => {
      fixture.detectChanges();
      expect(component.locale()).toBe('fr-BE');
    });
  });

  describe('Prefix and Suffix', () => {
    it('should accept custom prefix', () => {
      fixture.componentRef.setInput('prefix', '$');
      fixture.detectChanges();
      expect(component.prefix()).toBe('$');
    });

    it('should accept custom suffix', () => {
      fixture.componentRef.setInput('suffix', '%');
      fixture.detectChanges();
      expect(component.suffix()).toBe('%');
    });

    it('should allow both prefix and suffix together', () => {
      fixture.componentRef.setInput('prefix', '€');
      fixture.componentRef.setInput('suffix', '/month');
      fixture.detectChanges();
      expect(component.prefix()).toBe('€');
      expect(component.suffix()).toBe('/month');
    });
  });

  describe('Size Variants', () => {
    it('should render normal size by default', () => {
      fixture.componentRef.setInput('sm', false);
      fixture.detectChanges();
      expect(component.sm()).toBe(false);
    });

  });

  describe('Min/Max Validation', () => {
    beforeEach(() => {
      fixture.componentRef.setInput('min', 0);
      fixture.componentRef.setInput('max', 100);
      fixture.detectChanges();
    });

    it('should reject value below minimum', () => {
      component.onTextChange('-1');
      expect(component.invalid()).toBe(true);
    });

    it('should reject value above maximum', () => {
      component.onTextChange('101');
      expect(component.invalid()).toBe(true);
    });

    it('should accept value at minimum boundary', () => {
      component.onTextChange('0');
      expect(component.invalid()).toBe(false);
    });

    it('should accept value at maximum boundary', () => {
      component.onTextChange('100');
      expect(component.invalid()).toBe(false);
    });

    it('should accept value in middle of range', () => {
      component.onTextChange('50');
      expect(component.invalid()).toBe(false);
    });
  });
});
