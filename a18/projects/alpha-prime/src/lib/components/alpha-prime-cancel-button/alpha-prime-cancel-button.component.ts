import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {NgClass} from "@angular/common";
import {ButtonModule} from "primeng/button";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'alpha-prime-cancel-button',
  standalone: true,
  imports: [
    NgClass,
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './alpha-prime-cancel-button.component.html',
  styleUrl: './alpha-prime-cancel-button.component.css'
})
export class AlphaPrimeCancelButtonComponent {
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<any>();
  @Input() caption = '';
  @Input() sm = false;

  constructor(ps: AlphaPrimeService) {
    this.caption = ps.getTr('alpha.buttons.cancel');
  }

  onClicked(): void {
    this.clicked.emit();
  }

}
