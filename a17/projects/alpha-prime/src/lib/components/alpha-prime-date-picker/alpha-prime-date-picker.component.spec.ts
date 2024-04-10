import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeDatePickerComponent } from './alpha-prime-date-picker.component';
import exp from "node:constants";
import spyOn = jest.spyOn;

describe('AlphaPrimeDatePickerComponent', () => {
  let component: AlphaPrimeDatePickerComponent;
  let fixture: ComponentFixture<AlphaPrimeDatePickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeDatePickerComponent);
    component = fixture.componentInstance;
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('placeHolder setter', () => {
    it('should set ph to an array of string', () => {
      component.placeHolder = ['ph1', 'ph2', 'ph3'];
      expect(component.ph).toEqual('ph1');
      jest.advanceTimersByTime(5001);
      expect(component.ph).toEqual('ph2');
      jest.advanceTimersByTime(5001);
      expect(component.ph).toEqual('ph3');
      jest.advanceTimersByTime(5001);
      expect(component.ph).toEqual('ph1');
    });
    it ('should set ph to a single string', ()=> {
      component.placeHolder = 'ph';
      expect(component.ph).toEqual('ph');
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

  describe('onClear', () => {
    it ('should clear', () => {
      spyOn(component.dateChange, 'emit');
      component.date = new Date();
      component.onClear();
      expect(component.date).toBeUndefined();
      expect(component.dateChange.emit)
        .toHaveBeenCalledWith(undefined);
    });
  });

  describe('onDateChanged', () => {
    it('should onDateChanged', () => {
      const dt = new Date();
      spyOn(component.dateChange, 'emit');
      component.onDateChanged(dt);
      expect(component.dateChange.emit)
        .toHaveBeenCalledWith(dt);
    });
  });

});
