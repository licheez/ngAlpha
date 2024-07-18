import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimePasswordInputComponent } from './alpha-prime-password-input.component';
import {EventEmitter} from "@angular/core";
import {jest} from "@jest/globals";

describe('AlphaPrimePasswordInputComponent', () => {
  let component: AlphaPrimePasswordInputComponent;
  let fixture: ComponentFixture<AlphaPrimePasswordInputComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimePasswordInputComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimePasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.name).not.toEqual('');
    expect(component.inputType).toEqual('password');
    expect(component.disabled).toBeFalsy();
    expect(component.password).toBeUndefined();
    expect(component.passwordChange).toBeInstanceOf(EventEmitter);
    expect(component.empty).toBeTruthy();
  });

  it('should emit passwordChange event when password is changed', () => {
    const newPassword = 'newPassword';
    jest.spyOn(component.passwordChange, 'emit');
    component.onPasswordChanged(newPassword);
    expect(component.passwordChange.emit).toHaveBeenCalledWith(newPassword);
  });

  it ('should toggle clear password', () => {
    expect(component.inputType).toEqual('password');
    component.onShowHide();
    expect(component.inputType).toEqual('text');
    component.onShowHide();
    expect(component.inputType).toEqual('password');
  });

});
