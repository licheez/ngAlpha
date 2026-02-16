import {Component, computed, EventEmitter, input, Output} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {AlphaPrimeModalService} from '../../services/alpha-prime-modal.service';
import {
  AlphaPrimeConfirmationModalComponent
} from '../alpha-prime-confirmation-modal/alpha-prime-confirmation-modal.component';

@Component({
  selector: 'alpha-prime-delete-button',
  imports: [
    Tooltip,
    Button
  ],
  templateUrl: './alpha-prime-delete-button.component.html',
  styleUrl: './alpha-prime-delete-button.component.css'
})
export class AlphaPrimeDeleteButtonComponent {

  private readonly logRoute = 'AlphaDeleteButton';

  disabled = input<boolean>(false);
  caption = input<string>('');
  effectiveCaption = computed(() =>
    this.caption() || this.mPs.getTr('alpha.buttons.delete')
  );
  sm = input<boolean>(false);
  busy = input<boolean>(false);

  showConfirmationModal = input<boolean>(true);
  modalTitle = input<string | undefined>();
  modalMessage = input<string | undefined>();
  modalYes = input<string | undefined>();
  modalNo = input<string | undefined>();

  @Output() clicked = new EventEmitter<any>();

  constructor(
    private mPs: AlphaPrimeService,
    private mMs: AlphaPrimeModalService) {
  }

  onClicked(): void {
    if (!this.showConfirmationModal()) {
      this.clicked.emit();
      return;
    }
    this.mMs.openModal(
      AlphaPrimeConfirmationModalComponent,
      this.logRoute, 'AlphaConfirmation')
      .subscribe(
        modal => {
          modal.init(
            (confirmed: boolean) => {
              if (confirmed) {
                this.clicked.emit();
              }
            },
            this.modalTitle(),
            this.modalMessage(),
            this.modalYes(),
            this.modalNo());
        });
  }
}
