import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {AlphaPrimeModalService} from "../../services/alpha-prime-modal.service";
import {
  AlphaPrimeConfirmationModalComponent
} from "../alpha-prime-confirmation-modal/alpha-prime-confirmation-modal.component";
import {ButtonModule} from "primeng/button";
import {NgClass, NgIf} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'alpha-prime-delete-button',
  standalone: true,
  imports: [
    ButtonModule,
    NgClass,
    TooltipModule,
    NgIf
  ],
  templateUrl: './alpha-prime-delete-button.component.html',
  styleUrl: './alpha-prime-delete-button.component.css'
})
export class AlphaPrimeDeleteButtonComponent {
  private readonly logRoute = 'AlphaDeleteButton';

  @Input() disabled = false;
  @Input() busy = false;
  @Output() clicked = new EventEmitter<any>();
  @Input() caption = '';
  @Input() sm = false;
  @Input() showConfirmationModal = true;

  constructor(
    ps: AlphaPrimeService,
    private mMs: AlphaPrimeModalService) {
    this.caption = ps.getTr('alpha.buttons.delete');
  }

  onClicked(): void {
    if (!this.showConfirmationModal) {
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
            });
        });
  }
}
