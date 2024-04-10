import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AlphaPrimeCurrencyInputComponent } from './alpha-prime-currency-input.component';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import spyOn = jest.spyOn;

describe('AlphaPrimeCurrencyInputComponent', () => {
  let component: AlphaPrimeCurrencyInputComponent;
  let fixture: ComponentFixture<AlphaPrimeCurrencyInputComponent>;
  let inputElement: DebugElement;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule]
    });

    fixture = TestBed.createComponent(AlphaPrimeCurrencyInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElement = fixture.debugElement.query(By.css("input[type='text']"));
  });

  describe('value setter', () => {
    it ('should set an undefined value', () => {
      component.value = undefined;
      expect(component.sVal).toBeUndefined();
    });
    it ('should set a value equal to zero', () => {
      component.value = 0;
      expect(component.sVal).toEqual('0');
    });
    it ('should set a defined non zero value', () => {
      component.value = 125;
      expect(component.sVal).toEqual('125');
    });
  });

  describe('value getter', () => {
    it('should get an undefined value', () => {
      component.sVal = undefined;
      expect(component.value).toBeUndefined();
    });
    it('should get a valid number value', () =>{
      component.sVal = '1.23';
      expect(component.value).toEqual(1.23);
    });
    it ('should get a non numeric value', () => {
      component.sVal = 'some non numeric value';
      expect(component.value).toBeUndefined();
    });
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
  })

  describe('onTextChange', () => {
    it ('should handle undefined value', () => {
      spyOn(component, 'onClear');
      component.onTextChange('');
      expect(component.onClear).toHaveBeenCalled();
    });
    it ('should handle -0', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('-0');
      expect(component.invalid).toBeFalsy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle -,', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('-,');
      expect(component.invalid).toBeFalsy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle -0,', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('-0,');
      expect(component.invalid).toBeFalsy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it('should handle non numeric value', () => {
      spyOn(component.valueChange, 'emit');
      component.onTextChange('some non numeric value');
      expect(component.invalid).toBeTruthy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle value lower than allowed min', () => {
      spyOn(component.valueChange, 'emit');
      component.min = 1;
      component.onTextChange('0');
      expect(component.invalid).toBeTruthy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle value higher than allowed max', () => {
      spyOn(component.valueChange, 'emit');
      component.max = 1;
      component.onTextChange('2');
      expect(component.invalid).toBeTruthy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle in range value', () => {
      spyOn(component.valueChange, 'emit');
      component.min = 0;
      component.max = 10;
      component.onTextChange('2');
      expect(component.invalid).toBeFalsy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(2);

    });
  });

  // Test case for input value setting and getting
  it('should handle value setting and getting correctly', () => {
    component.value = 100;
    fixture.detectChanges();
    //expect(inputElement.nativeElement.value).toEqual('100');
    inputElement.nativeElement.value = '200';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    expect(component.value).toEqual(200);
  });

  // Test case for input value change event
  it('should handle value change event correctly', () => {
    component.value = 100;
    const spy =
      jest.spyOn(component.valueChange, 'emit');
    inputElement.nativeElement.value = '200';
    inputElement.nativeElement.dispatchEvent(new Event('input'));
    expect(spy).toHaveBeenCalledWith(200);
  });

  // Test case for onClear function
  it('should clear the value correctly when onClear is called', () => {
    component.value = 100;
    component.onClear();
    fixture.detectChanges();
    expect(component.value).toBeUndefined();
    expect(inputElement.nativeElement.value).toEqual('');
  });

  // Test case for onBlur function
  it('should format the value correctly when onBlur is called', () => {
    component.value = 100.123;
    component.onBlur();
    fixture.detectChanges();
    expect(component.value).toEqual(100.12);
    //expect(inputElement.nativeElement.value).toEqual('100.12');
  });
});
