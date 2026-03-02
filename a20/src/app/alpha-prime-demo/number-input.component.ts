import {ChangeDetectionStrategy, Component, model} from '@angular/core';
import {
  AlphaPrimeNumberInputComponent
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-number-input/alpha-prime-number-input.component';
import {FormsModule} from '@angular/forms';

@Component({
  selector: 'app-number-input',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Number Input Demo</h2>

      <form novalidate autocomplete="off"
            class="p-fluid p-formgrid grid">

        <!-- Basic Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="basic-number">Basic Number Input</label>
          <alpha-prime-number-input
            id="basic-number"
            [(ngModel)]="basicValue"
            placeHolder="Enter a number"
            locale="en-US"
            name="basic">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ basicValue() }}</strong></p>
        </div>

        <!-- Number Input with Min/Max -->
        <div class="p-field col-12 md:col-6">
          <label for="range-number">Number Input (Min: 0, Max: 100)</label>
          <alpha-prime-number-input
            id="range-number"
            [(ngModel)]="rangeValue"
            placeHolder="Enter 0-100"
            [min]="0"
            [max]="100"
            name="range">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ rangeValue() }}</strong></p>
        </div>

        <!-- Number Input with Prefix -->
        <div class="p-field col-12 md:col-6">
          <label for="prefix-number">Number with Currency Prefix ($)</label>
          <alpha-prime-number-input
            id="prefix-number"
            [(ngModel)]="currencyValue"
            prefix="$"
            placeHolder="0.00"
            [decimals]="2"
            name="currency">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ currencyValue() }}</strong></p>
        </div>

        <!-- Number Input with Suffix -->
        <div class="p-field col-12 md:col-6">
          <label for="suffix-number">Number with Percentage Suffix (%)</label>
          <alpha-prime-number-input
            id="suffix-number"
            [(ngModel)]="percentageValue"
            suffix="%"
            [min]="0"
            [max]="100"
            placeHolder="0"
            name="percentage">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ percentageValue() }}%</strong></p>
        </div>

        <!-- Small Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="small-number">Small Size Number Input</label>
          <alpha-prime-number-input
            id="small-number"
            [(ngModel)]="smallValue"
            [sm]="true"
            placeHolder="Small input"
            name="small">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ smallValue() }}</strong></p>
        </div>

        <!-- Disabled Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="disabled-number">Disabled Number Input</label>
          <alpha-prime-number-input
            id="disabled-number"
            [(ngModel)]="disabledValue"
            [disabled]="true"
            placeHolder="This is disabled"
            name="disabled">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ disabledValue() }}</strong></p>
        </div>

        <!-- Readonly Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="readonly-number">Readonly Number Input</label>
          <alpha-prime-number-input
            id="readonly-number"
            [(ngModel)]="readonlyValue"
            [readonly]="true"
            [readonlyCaption]="'Read-only'"
            name="readonly">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ readonlyValue() }}</strong></p>
        </div>

        <!-- Decimal Number Input -->
        <div class="p-field col-12 md:col-6">
          <label for="decimal-number">Decimal Number Input (2 decimals)</label>
          <alpha-prime-number-input
            id="decimal-number"
            [(ngModel)]="decimalValue"
            [decimals]="2"
            placeHolder="0.00"
            name="decimal">
          </alpha-prime-number-input>
          <p class="text-sm text-gray-600 mt-2">Current value: <strong>{{ decimalValue() }}</strong></p>
        </div>

        <!-- Negative Numbers Allowed -->
        <div class="p-field col-12 md:col-6">
          <label for="negative-number">Number Input with Negatives (-50 to 50)</label>
          <alpha-prime-number-input
            id="negative-number"
            [(ngModel)]="negativeValue"
            [min]="-50"
            [max]="50"
            placeHolder="Can be negative"
            name="negative">
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
    AlphaPrimeNumberInputComponent,
    FormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class NumberInputComponent {

  // Interactive demo signals using model() for two-way binding
  basicValue = model<number | undefined>(undefined);
  rangeValue = model<number | undefined>(undefined);
  currencyValue = model<number | undefined>(undefined);
  percentageValue = model<number | undefined>(undefined);
  smallValue = model<number | undefined>(undefined);
  disabledValue = model<number | undefined>(42);
  readonlyValue = model<number | undefined>(99);
  decimalValue = model<number | undefined>(undefined);
  negativeValue = model<number | undefined>(undefined);
}
