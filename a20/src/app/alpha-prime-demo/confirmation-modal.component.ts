import {Component} from '@angular/core';
import {Button} from 'primeng/button';
import {AlphaPrimeModalService} from '../../../projects/alpha-prime/src/lib/services/alpha-prime-modal.service';

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
  ]
})
export class ConfirmationModalComponent {

  constructor(
    private mMs: AlphaPrimeModalService) {}

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
