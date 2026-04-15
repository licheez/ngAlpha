import {ChangeDetectionStrategy, Component, computed, effect, inject, input, output, signal} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {InputTextModule} from 'primeng/inputtext';
import {KeyFilterModule} from 'primeng/keyfilter';
import {NgClass} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {ButtonModule} from 'primeng/button';
import {RippleModule} from 'primeng/ripple';
import {InputGroup} from 'primeng/inputgroup';

@Component({
  selector: 'alpha-prime-number-input',
  standalone: true,
  imports: [
    InputTextModule,
    KeyFilterModule,
    NgClass,
    FormsModule,
    ButtonModule,
    RippleModule,
    InputGroup
  ],
  templateUrl: './alpha-prime-number-input.component.html',
  styleUrl: './alpha-prime-number-input.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeNumberInputComponent {

  private readonly mPs = inject(AlphaPrimeService);

  // Input signals for configuration
  name = input<string | undefined>(this.mPs.generateRandomName());
  disabled = input(false);
  placeHolder = input('');
  prefix = input('');
  suffix = input('');
  decimals = input(0);
  min = input(-Number.MAX_VALUE);
  max = input(Number.MAX_VALUE);
  locale = input('fr-BE');
  readonly = input(false);
  readonlyCaption = input<string | undefined>('');
  sm = input(false);
  showClear = input(true);
  value = input<number | undefined>();

  // Internal state
  sVal = signal<string | undefined>(undefined);
  invalid = signal(false);

  // Validation regex
  readonly realNumber: RegExp = /[0-9\,\.\-]/;

  // Output events
  valueChange = output<number | undefined>();

  // Style objects
  private readonly baseInputStyle = {
    'width': '100%',
    'border-top-right-radius': '0',
    'border-bottom-right-radius': '0'
  };

  private readonly smInputStyle = {
    'width': '100%',
    'border-top-right-radius': '0',
    'border-bottom-right-radius': '0',
    'font-size': 'x-small'
  };

  // Computed derived state
  inputStyle = computed(
    () => this.sm()
      ? this.smInputStyle : this.baseInputStyle
  );

  constructor() {
    // Sync value input to internal state when value changes
    effect(() => {
      const val = this.value();
      switch (val) {
        case undefined:
          this.sVal.set(undefined);
          break;
        case 0:
          this.sVal.set('0');
          break;
        default:
          this.sVal.set(val.toString());
      }
    });
  }

  /**
   * Converts the internal string value to a number
   * @returns the parsed number or undefined if invalid
   */
  getNumericValue(): number | undefined {
    if (!this.sVal()) {
      return undefined;
    }
    const n = Number(this.sVal());
    return isNaN(n) ? undefined : n;
  }

  /**
   * Handles text input changes and validates the value
   * @param sVal the string value from the input
   */
  onTextChange(sVal: string | number | undefined): void {
    if (!sVal) {
      this.onClear();
      return;
    }

    sVal = `${sVal}`;
    this.sVal.set(sVal.replaceAll(',', '.'));

    // Handle special negative cases
    if (this.sVal() === '-0'
      || this.sVal() === '-.'
      || this.sVal() === '-0.') {
      this.invalid.set(false);
      this.valueChange.emit(undefined);
      return;
    }

    const n = Number(this.sVal());
    let v: number | undefined;

    // Validate the number
    if (isNaN(n)
      || n < this.min()
      || n > this.max()) {
      this.invalid.set(true);
      v = undefined;
    } else {
      this.invalid.set(false);
      v = n;
    }

    this.valueChange.emit(v);
  }

  /**
   * Clears the input value and emits undefined
   */
  onClear(): void {
    this.invalid.set(false);
    this.sVal.set(undefined);
    this.valueChange.emit(undefined);
  }

  /**
   * Validates input character based on regex
   * @param char the character to validate
   * @returns true if character is valid
   */
  isValidCharacter(char: string): boolean {
    return this.realNumber.test(char);
  }
}
