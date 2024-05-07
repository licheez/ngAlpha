import {Component, EventEmitter, Input, Output} from '@angular/core';
import {
  AlphaEmsBaseApi,
  AlphaEmsBaseComponent,
  AlphaEmsFormInput,
  AlphaEmsFormResult,
  AlphaEmsService
} from "@pvway/alpha-common";
import {EmsCustFormModel} from "./ems-cust-form-model";
import {ICustomerBody, ICustomerEi, ICustomerHead} from "../../model/customer";
import {EmsCustomerApi} from "../../api/ems-customer-api";


@Component({
  selector: 'app-ems-cust-form',
  standalone: true,
  imports: [],
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
  cancelled = new EventEmitter();

  constructor(ems: AlphaEmsService) {
    super(
      new EmsCustomerApi(ems),
      (
        api: AlphaEmsBaseApi<ICustomerHead, ICustomerBody, ICustomerEi>,
        fi: AlphaEmsFormInput<ICustomerBody>) => new EmsCustFormModel(
        api as EmsCustomerApi, fi),
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
