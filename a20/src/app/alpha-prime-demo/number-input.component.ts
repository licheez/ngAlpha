import {ChangeDetectionStrategy, Component, signal} from '@angular/core';
import {
  AlphaPrimeNumberInputComponent
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-number-input/alpha-prime-number-input.component';

@Component({
  selector: 'app-number-input',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Number Input Demo</h2>

      <form class="p-fluid p-formgrid grid">

        <!-- Basic Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="basic-number">Basic Number Input</label>
          <alpha-prime-number-input
            id="basic-number"
            [value]="basicValue()"
            (valueChange)="basicValue.set($event)"
            [placeHolder]="'Enter a number'"
            [locale]="'en-US'">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ basicValue() }}</strong></p>
        </div>

        <!-- Number Input with Min/Max -->
        <div class="p-field col-12 md:col-6">
          <label for="range-number">Number Input (Min: 0, Max: 100)</label>
          <alpha-prime-number-input
            id="range-number"
            [value]="rangeValue()"
            (valueChange)="rangeValue.set($event)"
            [placeHolder]="'Enter 0-100'"
            [min]="0"
            [max]="100">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ rangeValue() }}</strong></p>
        </div>

        <!-- Number Input with Prefix -->
        <div class="p-field col-12 md:col-6">
          <label for="prefix-number">Number with Currency Prefix ($)</label>
          <alpha-prime-number-input
            id="prefix-number"
            [value]="currencyValue()"
            (valueChange)="currencyValue.set($event)"
            [prefix]="'€'"
            [placeHolder]="'0.00'"
            [decimals]="2">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>€ {{ currencyValue() }}</strong></p>
        </div>

        <!-- Number Input with Suffix -->
        <div class="p-field col-12 md:col-6">
          <label for="suffix-number">Number with Percentage Suffix (%)</label>
          <alpha-prime-number-input
            id="suffix-number"
            [value]="percentageValue()"
            (valueChange)="percentageValue.set($event)"
            [suffix]="'%'"
            [min]="0"
            [max]="100"
            [placeHolder]="'0'">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ percentageValue() }}%</strong></p>
        </div>

        <!-- Small Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="small-number">Small Size Number Input</label>
          <alpha-prime-number-input
            id="small-number"
            [value]="smallValue()"
            (valueChange)="smallValue.set($event)"
            [sm]="true"
            [placeHolder]="'Small input'">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ smallValue() }}</strong></p>
        </div>

        <!-- Disabled Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="disabled-number">Disabled Number Input</label>
          <alpha-prime-number-input
            id="disabled-number"
            [value]="disabledValue()"
            (valueChange)="disabledValue.set($event)"
            [disabled]="true"
            [placeHolder]="'This is disabled'">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ disabledValue() }}</strong></p>
        </div>

        <!-- Readonly Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="readonly-number">Readonly Number Input</label>
          <alpha-prime-number-input
            id="readonly-number"
            [value]="readonlyValue()"
            (valueChange)="readonlyValue.set($event)"
            [readonly]="true"
            [readonlyCaption]="readonlyCaption()">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ readonlyValue() }}</strong></p>
        </div>

        <!-- Decimal Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="decimal-number">Decimal Number Input (2 decimals)</label>
          <alpha-prime-number-input
            id="decimal-number"
            [value]="decimalValue()"
            (valueChange)="decimalValue.set($event)"
            [decimals]="2"
            [placeHolder]="'0.00'">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ decimalValue() }}</strong></p>
        </div>

        <!-- Negative Numbers Allowed -->
        <div class="p-field col-12 md:col-6">
          <label for="negative-number">Number Input with Negatives (-50 to 50)</label>
          <alpha-prime-number-input
            id="negative-number"
            [value]="negativeValue()"
            (valueChange)="negativeValue.set($event)"
            [min]="-50"
            [max]="50"
            [placeHolder]="'Can be negative'">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ negativeValue() }}</strong></p>
        </div>

        <!-- Status Display -->
        <div class="p-field col-12">
          <h3>Demo Status</h3>
          <ul>
            <li>Basic Value: <strong>{{ basicValue() }}</strong></li>
            <li>Range Value (0-100): <strong>{{ rangeValue() }}</strong></li>
            <li>Currency Value: <strong>€{{ currencyValue() }}</strong></li>
            <li>Percentage Value: <strong>{{ percentageValue() }}%</strong></li>
            <li>Small Value: <strong>{{ smallValue() }}</strong></li>
            <li>Disabled Value: <strong>{{ disabledValue() }}</strong></li>
            <li>Readonly Value: <strong>{{ readonlyValue() }}</strong></li>
            <li>Decimal Value: <strong>{{ decimalValue() }}</strong></li>
            <li>Negative Value: <strong>{{ negativeValue() }}</strong></li>
          </ul>
        </div>

      </form>

    </section>
  `,
  styles: [`
    h2 {
      margin-bottom: 2rem;
    }

    h3 {
      margin-top: 1.5rem;
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }

    label {
      display: block;
      margin-bottom: 0.5rem;
      font-weight: 500;
    }

    ul {
      list-style: none;
      padding: 0;
    }

    li {
      padding: 0.5rem 0;
      font-size: 0.95rem;
    }

    .text-sm {
      font-size: 0.875rem;
    }

    .text-gray-600 {
      color: #4b5563;
    }

    .mt-2 {
      margin-top: 0.5rem;
    }

    .md\\:col-6 {
      @media (min-width: 768px) {
        width: 50%;
      }
    }
  `],
  imports: [
    AlphaPrimeNumberInputComponent
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberInputComponent {

  // Interactive demo signals using signal() for state management
  basicValue = signal<number | undefined>(undefined);
  rangeValue = signal<number | undefined>(undefined);
  currencyValue = signal<number | undefined>(undefined);
  percentageValue = signal<number | undefined>(undefined);
  smallValue = signal<number | undefined>(undefined);
  disabledValue = signal<number | undefined>(42);
  readonlyValue = signal<number | undefined>(99);
  readonlyCaption = signal<string | undefined>('99');
  decimalValue = signal<number | undefined>(undefined);
  negativeValue = signal<number | undefined>(undefined);
}
