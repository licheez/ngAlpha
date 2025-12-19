import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-alpha-prime-index',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime Components</h2>
      <ul>
        <li><a [routerLink]="['/alpha-prime', 'add-button']">AddButton</a></li>
        <li><a [routerLink]="['/alpha-prime', 'auto-complete']">AutoComplete</a></li>
        <li><a [routerLink]="['/alpha-prime', 'cancel-button']">CancelButton</a></li>
        <li><a [routerLink]="['/alpha-prime', 'confirmation-modal']">ConfirmationModal</a></li>
        <li><a [routerLink]="['/alpha-prime', 'currency-input']">CurrencyInput</a></li>
      </ul>
    </section>
  `,
  imports: [RouterModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeIndexComponent {
  protected readonly title = signal('Alpha Prime');
}
