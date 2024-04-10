import {Component, EventEmitter, Input, Output} from '@angular/core';
import { v4 as uuidV4 } from 'uuid';

import {NgClass, NgIf} from "@angular/common";

import {InputTextModule} from "primeng/inputtext";
import {KeyFilterModule} from "primeng/keyfilter";
import {FormsModule} from "@angular/forms";
import {ButtonModule} from "primeng/button";
import {RippleModule} from "primeng/ripple";

@Component({
  selector: 'alpha-prime-currency-input',
  standalone: true,
  imports: [
    NgIf,
    InputTextModule,
    KeyFilterModule,
    NgClass,
    FormsModule,
    ButtonModule,
    RippleModule
  ],
  templateUrl: './alpha-prime-currency-input.component.html',
  styleUrl: './alpha-prime-currency-input.component.css'
})
export class AlphaPrimeCurrencyInputComponent {

  @Input() name = uuidV4();
  @Input() disabled = false;
  @Input() placeHolder = '';
  @Input() min = - Number.MAX_VALUE;
  @Input() max = Number.MAX_VALUE;
  @Input() currency = 'EUR';
  @Input() currencySymbol = '€';
  @Input() locale = 'fr-BE';
  @Input() readonly = false;
  @Input() readonlyCaption: string | undefined = '';
  @Input() sm = false;
  @Input() showClear = true;

  //https://www.regextester.com/
  // noinspection RegExpRedundantEscape
  realNumber: RegExp = /[0-9\,\.\-]/;

  sVal: string | undefined;
  @Input()
  set value(value: number | undefined) {
    switch (value) {
      case undefined:
        this.sVal = undefined;
        break;
      case 0:
        this.sVal = '0';
        break;
      default:
        this.sVal = value.toString();
    }
  }
  get value(): number | undefined {
    if (!this.sVal) {
      return undefined;
    }
    const n = Number(this.sVal);
    return isNaN(n) ? undefined : n;
  }
  @Output() valueChange = new EventEmitter<number>();

  invalid = false;

  baseInputStyle = {
    'width': '100%',
    'border-top-right-radius': '0',
    'border-bottom-right-radius': '0'
  };

  smInputStyle = {
    'width': '100%',
    'border-top-right-radius': '0',
    'border-bottom-right-radius': '0',
    'font-size': 'x-small'
  };

  get inputStyle(): any {
    return this.sm
      ? this.smInputStyle
      : this.baseInputStyle;
  }

  onTextChange(sVal: string) {
    if (!sVal) {
      this.onClear();
      return;
    }

    this.sVal = sVal.replaceAll(',', '.');
    if (this.sVal === '-0'
      || this.sVal === '-.'
      || this.sVal === '-0.') {
      this.invalid = false;
      this.valueChange.emit(undefined);
      return;
    }
    const n = Number(this.sVal);
    let v: number | undefined;
    if (isNaN(n)
      || n < this.min
      || n > this.max) {
      this.invalid = true;
      v = undefined;
    } else {
      this.invalid = false;
      v = n;
    }
    this.valueChange.emit(v);
  }

  onClear(): void {
    this.invalid = false;
    this.sVal = undefined;
    this.valueChange.emit(undefined);
  }

  onBlur(): void {
    const v = this.value;
    if (v) {
      this.sVal = v.toFixed(2);
    }
  }
}
