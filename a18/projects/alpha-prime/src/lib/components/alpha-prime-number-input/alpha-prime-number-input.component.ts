import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";

@Component({
  selector: 'alpha-prime-number-input',
  standalone: true,
  imports: [],
  templateUrl: './alpha-prime-number-input.component.html',
  styleUrl: './alpha-prime-number-input.component.css'
})
export class AlphaPrimeNumberInputComponent {

  @Input() name = '';
  @Input() disabled = false;
  @Input() placeHolder = '';
  @Input() prefix = '';
  @Input() suffix = '';
  @Input() decimals: number = 0;
  @Input() min = - Number.MAX_VALUE;
  @Input() max = Number.MAX_VALUE;
  @Input() locale = 'fr-BE';
  @Input() readonly = false;
  @Input() readonlyCaption: string | undefined = '';
  @Input() sm = false;
  @Input() showClear = true;

  //https://www.regextester.com/
  realNumber: RegExp = /[0-9\,\.\-]/;

  sVal: string | undefined;
  invalid = false;
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

  constructor(
    ps: AlphaPrimeService) {
    this.name = ps.generateRandomName();
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


}
