import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  AlphaPrimeDebugTagComponent,
  AlphaPrimeRemainingHeightDirective, AlphaPrimeScrollerComponent,
  AlphaPrimeScrollerModel
} from "@pvway-dev/alpha-prime";
import {AlphaEmsService} from "@pvway/alpha-common";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {EmsCustCardComponent} from "../ems-cust-card/ems-cust-card.component";
import {ICustomerHead} from "../../model/customer";
import {EmsCustomerApi} from "../../api/ems-customer-api";

class Model extends AlphaPrimeScrollerModel<ICustomerHead> {
}

@Component({
  selector: 'app-ems-cust-list',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    NgIf,
    AlphaPrimeRemainingHeightDirective,
    AlphaPrimeScrollerComponent,
    NgForOf,
    NgStyle,
    EmsCustCardComponent
  ],
  templateUrl: './ems-cust-list.component.html',
  styleUrl: './ems-cust-list.component.scss'
})
export class EmsCustListComponent implements OnInit {

  private mApi: EmsCustomerApi;
  model: Model | undefined;

  selectedItem: ICustomerHead | undefined;

  @Output() listLoaded = new EventEmitter<ICustomerHead>();
  @Output() itemSelected = new EventEmitter<ICustomerHead>();

  constructor(ems: AlphaEmsService) {
    this.mApi = new EmsCustomerApi(ems);
  }

  ngOnInit(): void {
    this.loadFirstPage();
  }

  loadFirstPage(): void {
    this.model = new Model(
      (skip: number, take: number) =>
        this.mApi.list(false, skip, take), 10);
    this.model.loadItems().subscribe({
      next: item => {
        this.selectedItem = item;
        this.listLoaded.emit(item);
      }
    });
  }

  onRowSelected(item: ICustomerHead): void {
    this.selectedItem = item;
    this.itemSelected.emit(item);
  }

}
