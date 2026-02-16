import {Component, ChangeDetectionStrategy, signal, Type} from '@angular/core';
import { RouterModule } from '@angular/router';
import {DialogService} from 'primeng/dynamicdialog';
import {AlphaPrimeModalService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal.service';
import {IAlphaPrimeModalConfig} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal-abstractions';

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
        <li><a [routerLink]="['/alpha-prime', 'date-picker']">DatePicker</a></li>
        <li><a [routerLink]="['/alpha-prime', 'date-range-picker']">DateRangePicker</a></li>
        <li><a [routerLink]="['/alpha-prime', 'delete-button']">DeleteButton</a></li>
        <li><a [routerLink]="['/alpha-prime', 'edit-button']">EditButton</a></li>
      </ul>
    </section>
  `,
  imports: [RouterModule],
  providers: [DialogService],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaPrimeIndexComponent {
  protected readonly title = signal('Alpha Prime');

  constructor(
    ds: DialogService,
    private mMs: AlphaPrimeModalService) {
    const dsOpen:
      (component: Type<any>, ddc: IAlphaPrimeModalConfig) => any =
      (component: Type<any>, ddc: IAlphaPrimeModalConfig) =>
        ds.open(component, ddc);
    this.mMs.init(dsOpen);
  }

}
