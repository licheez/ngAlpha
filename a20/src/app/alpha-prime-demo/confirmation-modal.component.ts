import {Component, Type} from '@angular/core';
import {Button} from 'primeng/button';
import {AlphaPrimeModalService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal.service';
import {DialogService} from 'primeng/dynamicdialog';
import {IAlphaPrimeModalConfig} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal-abstractions';

@Component({
  selector: 'app-confirmation-modal',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - ConfirmationModal Demo</h2>
      <p-button label="open modal"
         (click)="onClicked()" ></p-button>
    </section>
  `,
  imports: [
    Button
  ],
  styles: [],
  providers: [DialogService],
})
export class ConfirmationModalComponent {

  constructor(
    ds: DialogService,
    private mMs: AlphaPrimeModalService) {
    const dsOpen:
      (component: Type<any>, ddc: IAlphaPrimeModalConfig) => any =
      (component: Type<any>, ddc: IAlphaPrimeModalConfig) =>
        ds.open(component, ddc);
    this.mMs.init(dsOpen);
  }

  onClicked(): void {
    this.mMs.openConfirmationModal(
      'confirmation modal demo',
      'Confirmation Required',
      'Are you sure you want to proceed?',
      'Yes, proceed',
      'No, cancel').subscribe(
        confirmed => {
          alert('confirmed: ' + confirmed);
        }
    );

  }
}
