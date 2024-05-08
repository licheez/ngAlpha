import {Component, OnInit} from '@angular/core';
import {AlphaEmsFormInput, AlphaEmsFormResult} from "@pvway/alpha-common";
import {ICustomerBody} from "../../model/customer";
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlphaPrimeDebugTagComponent} from "@pvway-dev/alpha-prime";
import {EmsCustFormComponent} from "../ems-cust-form/ems-cust-form.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-ems-cust-modal',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    EmsCustFormComponent,
    NgIf
  ],
  templateUrl: './ems-cust-modal.component.html',
  styleUrl: './ems-cust-modal.component.scss'
})
export class EmsCustModalComponent implements OnInit {
  onClose: (res: AlphaEmsFormResult<ICustomerBody>) => any
    = () => {}
  fi: AlphaEmsFormInput<ICustomerBody> | undefined;

  constructor(
    private mDdc: DynamicDialogConfig,
    private mDdr: DynamicDialogRef) {}

  ngOnInit() :void {
    this.mDdc.header = "Customer";
    this.mDdc.data.setInstance(this);
  }

  initForRead(
    id: string,
    onClose: () => any): void {
    this.fi = AlphaEmsFormInput.factorForRead([id]);
    this.onClose = onClose;
  }

  initForCreate(
    onClose: (res: AlphaEmsFormResult<ICustomerBody>) => any,
    term?: string): void {
    this.onClose = onClose;
    this.fi = AlphaEmsFormInput.factorForNew({
      term: term
    });
  }

  initForUpdate(
    id: string,
    onClose: (res: AlphaEmsFormResult<ICustomerBody>) => any): void {
    this.fi = AlphaEmsFormInput.factorForEdit([id]);
    this.onClose = onClose;
  }

  onCancelled(): void {
    this.mDdr.destroy();
  }

  onSaved(res: AlphaEmsFormResult<ICustomerBody>): void {
    this.onClose(res);
    this.mDdr.close(res);
  }

}
