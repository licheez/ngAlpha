import {Component, OnInit} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {DynamicDialogConfig, DynamicDialogRef} from 'primeng/dynamicdialog';
import {Button} from 'primeng/button';
import {AlphaPrimeDebugTagComponent} from '../alpha-prime-debug-tag/alpha-prime-debug-tag.component';

@Component({
  selector: 'alpha-prime-confirmation-modal',
  imports: [
    AlphaPrimeDebugTagComponent,
    Button
  ],
  templateUrl: './alpha-prime-confirmation-modal.component.html',
  styleUrls: ['./alpha-prime-confirmation-modal.component.css']
})
export class AlphaPrimeConfirmationModalComponent implements OnInit {
  onClose: (confirmed: boolean) => any = () => { };

  title: string;
  message: string;
  yes: string;
  no: string;

  constructor(
    private mPs: AlphaPrimeService,
    private mDdr: DynamicDialogRef,
    private mDdc: DynamicDialogConfig) {
    this.title = this.mPs.getTr('alpha.confirmationModal.title');
    this.message = this.mPs.getTr('alpha.confirmationModal.message');
    this.yes = this.mPs.getTr('alpha.confirmationModal.yes');
    this.no = this.mPs.getTr('alpha.confirmationModal.no');
  }

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
