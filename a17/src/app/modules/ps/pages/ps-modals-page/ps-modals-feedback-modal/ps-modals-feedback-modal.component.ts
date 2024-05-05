import {Component, OnInit} from '@angular/core';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {PsModalsFeedbackFormComponent} from "../ps-modals-feedback-form/ps-modals-feedback-form.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-ps-modals-feedback-modal',
  standalone: true,
  imports: [
    PsModalsFeedbackFormComponent,
    NgIf
  ],
  templateUrl: './ps-modals-feedback-modal.component.html',
  styleUrl: './ps-modals-feedback-modal.component.scss'
})
export class PsModalsFeedbackModalComponent implements OnInit {

  onClose: (rate: number) => any = () => {};
  ready = false;

  constructor(
    private mDdc: DynamicDialogConfig,
    private mDdr: DynamicDialogRef) { }

  ngOnInit() {
    this.mDdc.header = "The feedback modal";
    this.mDdc.data.setInstance(this);
  }

  init(
    onClose: (rate: number) => any): void {
      this.onClose = onClose;
      this.ready = true;
  }

  onCancel(): void {
    this.mDdr.destroy();
  }

  onRated(rate: number): void {
    this.onClose(rate);
    this.mDdr.close();
  }
}
