import { Component, Input, Output, EventEmitter } from '@angular/core';
import {ButtonModule} from "primeng/button";
import {NgClass} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";
import {AlphaPrimeService} from "../../services/alpha-prime.service";

@Component({
  selector: 'alpha-prime-add-button',
  standalone: true,
  templateUrl: './alpha-prime-add-button.component.html',
  imports: [
    ButtonModule,
    NgClass,
    TooltipModule,
    ButtonModule,
    TooltipModule
  ],
  styleUrl: './alpha-prime-add-button.component.css'
})
export class AlphaPrimeAddButtonComponent {

  @Input() disabled = false;
  @Input() caption = '';
  @Input() sm = false;
  @Output() clicked = new EventEmitter<any>();

  constructor(ps: AlphaPrimeService) {
    ps.getTr('alpha.buttons.add');
  }

  onClicked(): void {
    this.clicked.emit();
  }

}
