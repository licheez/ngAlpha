import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeNumberInputComponent } from './alpha-prime-number-input.component';

describe('AlphaPrimeNumberInputComponent', () => {
  let component: AlphaPrimeNumberInputComponent;
  let fixture: ComponentFixture<AlphaPrimeNumberInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeNumberInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeNumberInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
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
  });

  describe('onTextChange', () => {
    it ('should handle undefined value', () => {
      jest.spyOn(component, 'onClear');
      component.onTextChange('');
      expect(component.onClear).toHaveBeenCalled();
    });
    it ('should handle -0', () => {
      jest.spyOn(component.valueChange, 'emit');
      component.onTextChange('-0');
      expect(component.invalid).toBeFalsy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle -,', () => {
      jest.spyOn(component.valueChange, 'emit');
      component.onTextChange('-,');
      expect(component.invalid).toBeFalsy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle -0,', () => {
      jest.spyOn(component.valueChange, 'emit');
      component.onTextChange('-0,');
      expect(component.invalid).toBeFalsy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it('should handle non numeric value', () => {
      jest.spyOn(component.valueChange, 'emit');
      component.onTextChange('some non numeric value');
      expect(component.invalid).toBeTruthy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle value lower than allowed min', () => {
      jest.spyOn(component.valueChange, 'emit');
      component.min = 1;
      component.onTextChange('0');
      expect(component.invalid).toBeTruthy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle value higher than allowed max', () => {
      jest.spyOn(component.valueChange, 'emit');
      component.max = 1;
      component.onTextChange('2');
      expect(component.invalid).toBeTruthy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
    it ('should handle in range value', () => {
      jest.spyOn(component.valueChange, 'emit');
      component.min = 0;
      component.max = 10;
      component.onTextChange('2');
      expect(component.invalid).toBeFalsy();
      expect(component.valueChange.emit)
        .toHaveBeenCalledWith(2);
    });
  });


});
