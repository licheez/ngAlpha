import { Component } from '@angular/core';
import {
  AlphaPrimeConfirmationModalComponent,
  AlphaPrimeDebugTagComponent,
  AlphaPrimeModalService
} from "@pvway/alpha-prime";
import {ButtonModule} from "primeng/button";
import {PsModalsFeedbackModalComponent} from "../ps-modals-feedback-modal/ps-modals-feedback-modal.component";
import {NgIf} from "@angular/common";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-ps-modals-page',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    ButtonModule,
    NgIf,
    DividerModule
  ],
  templateUrl: './ps-modals-page.component.html',
  styleUrl: './ps-modals-page.component.scss'
})
export class PsModalsPageComponent {

  result = '';

  constructor(private mMs: AlphaPrimeModalService) { }

  onOpenConfirmation(): void {
    this.mMs.openModal(
      AlphaPrimeConfirmationModalComponent,
      'psModalsPage', 'confirmationModal',
      {draggable: true}).subscribe(
        m => m.init(
          (confirmed: boolean) => {
            this.result = confirmed ? 'Confirmed' : 'Not Confirmed';
            setTimeout(() => this.result = '', 2000);
          }));
  }

  onOpenFeedbackModal(): void {
    this.mMs.openModal(
      PsModalsFeedbackModalComponent,
      'psModalsPage', 'feedbackModal',
      {width: '300px'}).subscribe(
        m => m.init(
          (rate: number) => {
            this.result = rate.toString();
            setTimeout(() => this.result = '', 2000);
          }));
  }
}
