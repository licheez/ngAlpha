import {Component} from '@angular/core';
import {
  AlphaPrimeCurrencyInputComponent
} from '../../../projects/alpha-prime/src/lib/components/alpha-prime-currency-input/alpha-prime-currency-input.component';

@Component({
  selector: 'app-currency-input',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Currency Input Demo</h2>
      <alpha-prime-currency-input
        [(value)]="value"
      ></alpha-prime-currency-input>
    </section>
    <p>Value: {{value}}</p>
  `,
  imports: [
    AlphaPrimeCurrencyInputComponent
  ],
  styles: []
})

export class CurrencyInputComponent {
  value: number | undefined;
}
