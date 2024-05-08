import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlphaPrimeDebugTagComponent} from "@pvway-dev/alpha-prime";
import {NgClass, NgIf} from "@angular/common";
import {ICustomerHead} from "../../model/customer";

@Component({
  selector: 'app-ems-cust-card',
  standalone: true,
  imports: [
    AlphaPrimeDebugTagComponent,
    NgIf,
    NgClass
  ],
  templateUrl: './ems-cust-card.component.html',
  styleUrl: './ems-cust-card.component.scss'
})
export class EmsCustCardComponent {
  @Input() head: ICustomerHead | undefined;
  @Input() selected = false;
  @Output() clicked = new EventEmitter<ICustomerHead>();
}
