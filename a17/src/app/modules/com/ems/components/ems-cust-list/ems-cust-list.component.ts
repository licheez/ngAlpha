import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  AlphaPrimeDebugTagComponent, AlphaPrimeFilterBoxComponent, AlphaPrimeModalService,
  AlphaPrimeRemainingHeightDirective, AlphaPrimeScrollerComponent,
  AlphaPrimeScrollerModel
} from "@pvway-dev/alpha-prime";
import {AlphaEmsFormResult, AlphaEmsService} from "@pvway/alpha-common";
import {NgForOf, NgIf, NgStyle} from "@angular/common";
import {EmsCustCardComponent} from "../ems-cust-card/ems-cust-card.component";
import {ICustomerBody, ICustomerHead} from "../../model/customer";
import {EmsCustomerApi} from "../../api/ems-customer-api";
import {EmsCustModalComponent} from "../ems-cust-modal/ems-cust-modal.component";

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
    EmsCustCardComponent,
    AlphaPrimeFilterBoxComponent
  ],
  templateUrl: './ems-cust-list.component.html',
  styleUrl: './ems-cust-list.component.scss'
})
export class EmsCustListComponent implements OnInit {

  private mApi: EmsCustomerApi;
  model: Model | undefined;
  term = '';

  selectedItem: ICustomerHead | undefined;

  @Output() listLoaded = new EventEmitter<ICustomerHead>();
  @Output() itemSelected = new EventEmitter<ICustomerHead>();

  constructor(
    ems: AlphaEmsService,
    private mMs: AlphaPrimeModalService) {
    this.mApi = new EmsCustomerApi(ems);
  }

  ngOnInit(): void {
    this.loadFirstPage();
  }

  loadFirstPage(): void {
    this.model = new Model(
      (skip: number, take: number) =>
      {
        const options =
          new Map<string, string>([['term', this.term]]);
        return this.mApi.list(false, skip, take, options)
      }, 10);
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

  onTermChanged(term: string | undefined) {
    this.term = term || '';
    this.loadFirstPage();
  }

  onAdd(term: string | undefined): void {
    this.mMs.openModal(
      EmsCustModalComponent,
      'emsCustList', 'emsCustModal',
      { draggable: true}).subscribe(
        m=>
          m.initForCreate(
            (res: AlphaEmsFormResult<ICustomerBody>) => {
              const body = res.data!
              this.model?.prependItem(body);
              this.selectedItem = body;
              this.itemSelected.emit(body);
            }, term));
  }

}
