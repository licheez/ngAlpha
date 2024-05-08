import {Component, Input} from '@angular/core';
import {AlphaPrimeDebugTagComponent} from "@pvway-dev/alpha-prime";
import {ICustomerBody, ICustomerHead} from "../../model/customer";
import {AlphaEmsFormInput} from "@pvway/alpha-common";
import {EmsCustFormComponent} from "../ems-cust-form/ems-cust-form.component";
import {NgIf} from "@angular/common";

@Component({
  selector: 'app-ems-cust-view',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    EmsCustFormComponent,
    NgIf
  ],
  templateUrl: './ems-cust-view.component.html',
  styleUrl: './ems-cust-view.component.scss'
})
export class EmsCustViewComponent {

  fi: AlphaEmsFormInput<ICustomerBody> | undefined;
  private _head: ICustomerHead | undefined;
  @Input()
  set head(head: ICustomerHead | undefined) {
    this._head = head;
    this.fi = undefined;
    if (!head) {
      return;
    }
    console.log(head);
    this.fi = AlphaEmsFormInput.factorForRead(
      [head.id]);
  }
  get head(): ICustomerHead | undefined {
    return this._head;
  }

}
