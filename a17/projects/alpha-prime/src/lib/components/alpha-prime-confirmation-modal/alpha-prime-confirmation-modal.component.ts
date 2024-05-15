import {Component, OnInit} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlphaPrimeDebugTagComponent} from "../alpha-prime-debug-tag/alpha-prime-debug-tag.component";
import {ButtonModule} from "primeng/button";

@Component({
  selector: 'alpha-prime-confirmation-modal',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    ButtonModule
  ],
  templateUrl: './alpha-prime-confirmation-modal.component.html',
  styleUrl: './alpha-prime-confirmation-modal.component.css'
})
export class AlphaPrimeConfirmationModalComponent implements OnInit{

  onClose: (confirmed: boolean) => any = () => { };

  message = this.mPs.getTr('alpha.confirmationModal.message');
  yes = this.mPs.getTr('alpha.confirmationModal.yes');
  no = this.mPs.getTr('alpha.confirmationModal.no');

  constructor(
    private mPs: AlphaPrimeService,
    private mDdr: DynamicDialogRef,
    private mDdc: DynamicDialogConfig) { }

  ngOnInit() {
    this.mDdc.data.setInstance(this);
  }

  init(
    onClose: (confirmed: boolean) => any,
    title?: string,
    message?: string,
    yes?: string,
    no?: string) {
    this.onClose = onClose;

    setTimeout(
      () => {
        this.mDdc.header = title
          ? title
          : this.mPs.getTr('alpha.confirmationModal.title');
      }, 100);

    if (message) {
      this.message = message;
    }
    if (yes) {
      this.yes = yes;
    }
    if (no) {
      this.no = no;
    }
  }

  onYes(): void {
    this.onClose(true);
    this.mDdr.close(true);
  }

  onNo(): void {
    this.onClose(false);
    this.mDdr.close(false);
  }

}
