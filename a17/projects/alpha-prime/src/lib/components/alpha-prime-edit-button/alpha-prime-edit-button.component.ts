import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {ButtonModule} from "primeng/button";
import {NgClass} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'alpha-prime-edit-button',
  standalone: true,
  imports: [
    ButtonModule,
    NgClass,
    TooltipModule
  ],
  templateUrl: './alpha-prime-edit-button.component.html',
  styleUrl: './alpha-prime-edit-button.component.css'
})
export class AlphaPrimeEditButtonComponent {
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<any>();
  @Input() caption = this.mPs.getTr('alpha.buttons.edit');
  @Input() sm = false;

  constructor(private mPs: AlphaPrimeService) { }

  onClicked(): void {
    this.clicked.emit();
  }

}
