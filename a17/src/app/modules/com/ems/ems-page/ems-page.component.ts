import { Component } from '@angular/core';
import {AlphaPrimeDebugTagComponent} from "@pvway-dev/alpha-prime";
import {EmsCustListComponent} from "../components/ems-cust-list/ems-cust-list.component";
import {ICustomerHead} from "../model/customer";

@Component({
  selector: 'app-ems-page',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    EmsCustListComponent
  ],
  templateUrl: './ems-page.component.html',
  styleUrl: './ems-page.component.scss'
})
export class EmsPageComponent {

  selectedItem: ICustomerHead | undefined;

  onListLoaded(custHead: ICustomerHead | undefined) {
    this.selectedItem = custHead;
  }

  onItemSelected(custHead: ICustomerHead): void {
    this.selectedItem = custHead;
  }
}
