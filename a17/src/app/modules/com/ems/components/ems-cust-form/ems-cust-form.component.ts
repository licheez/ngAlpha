import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  AlphaEmsBaseComponent,
  AlphaEmsFormInput,
  AlphaEmsFormResult,
  AlphaEmsService
} from "@pvway/alpha-common";
import {EmsCustFormModel} from "./ems-cust-form-model";
import {ICustomerBody, ICustomerEi, ICustomerHead} from "../../model/customer";
import {EmsCustomerApi} from "../../api/ems-customer-api";
import {
  AlphaPrimeCancelButtonComponent,
  AlphaPrimeDebugTagComponent,
  AlphaPrimeLabelComponent,
  AlphaPrimeSaveButtonComponent,
  AlphaPrimeSelectComponent
} from "@pvway/alpha-prime";
import {NgIf} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {InputTextModule} from "primeng/inputtext";
import {DividerModule} from "primeng/divider";

@Component({
  selector: 'app-ems-cust-form',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    NgIf,
    AlphaPrimeLabelComponent,
    FormsModule,
    InputTextModule,
    AlphaPrimeSelectComponent,
    DividerModule,
    AlphaPrimeSaveButtonComponent,
    AlphaPrimeCancelButtonComponent
  ],
  templateUrl: './ems-cust-form.component.html',
  styleUrl: './ems-cust-form.component.scss'
})
export class EmsCustFormComponent
  extends AlphaEmsBaseComponent<ICustomerHead, ICustomerBody, ICustomerEi> {

  fm: EmsCustFormModel | undefined;

  @Input()
  set fi(fi: AlphaEmsFormInput<ICustomerBody>) {
    this.loadForm(fi).subscribe(
      fm =>
        this.fm = fm as EmsCustFormModel);
  }

  @Output()
  saved =
    new EventEmitter<AlphaEmsFormResult<ICustomerBody>>();
  @Output()
  cancelled = new EventEmitter();

  constructor(
    ems: AlphaEmsService) {
    super(new EmsCustomerApi(ems),
      () => new EmsCustFormModel(),
      true)
  }

  onSave(): void {
    this.save(this.fm!).subscribe({
      next: res =>
        this.saved.emit(res),
      error: e => console.error(e)
    });
  }

  onDelete(): void {
    this.delete().subscribe({
      next: res =>
        this.saved.emit(res),
      error: e => console.error(e)
    });
  }

  onCancel(): void {
    this.cancelled.emit();
  }

}
