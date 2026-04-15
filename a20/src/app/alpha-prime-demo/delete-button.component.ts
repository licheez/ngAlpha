import {Component, signal,} from '@angular/core';
import {AlphaPrimeDeleteButtonComponent}
  from '../../../projects/alpha-prime/src/lib/components/alpha-prime-delete-button/alpha-prime-delete-button.component';

@Component({
  selector: 'app-alpha-prime-delete-button',
  standalone: true,
  template: `
    <section>
      <h2>Alpha Prime - Delete Button Demo</h2>
      <p>Clicked: {{ clicks() }}</p>
      <alpha-prime-delete-button
        (clicked)="onClicked()"
        [caption]="'Delete Item'"
        [showConfirmationModal]="true"
        [modalTitle]="'Confirm Deletion'"
        [modalMessage]="'Are you sure you want to delete this item?'"
        [modalYes]="'Yes, delete it'"
        [modalNo]="'No, keep it'"
      ></alpha-prime-delete-button>
    </section>
  `,
  imports:[
    AlphaPrimeDeleteButtonComponent
  ]
})
export class DeleteButtonComponent {
  protected readonly clicks = signal(0);

  onClicked(): void {
    this.clicks.update(c => c + 1);
  }

}
