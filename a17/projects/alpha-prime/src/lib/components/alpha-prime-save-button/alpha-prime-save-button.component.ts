import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {AlphaPrimeLabelComponent} from "../alpha-prime-label/alpha-prime-label.component";
import {ButtonModule} from "primeng/button";
import {NgClass, NgIf} from "@angular/common";
import {TooltipModule} from "primeng/tooltip";

@Component({
  selector: 'alpha-prime-save-button',
  standalone: true,
  imports: [
    ButtonModule,
    NgClass,
    TooltipModule,
    NgIf
  ],
  templateUrl: './alpha-prime-save-button.component.html',
  styleUrl: './alpha-prime-save-button.component.css'
})
export class AlphaPrimeSaveButtonComponent {
  @Input() disabled = false;
  @Output() clicked = new EventEmitter<any>();
  @Input() caption = this.mPs.getTr('alpha.buttons.save');
  @Input() busy = false;
  @Input() sm = false;

  constructor(
    private mPs: AlphaPrimeService) {
  }

  onClicked(): void {
    this.clicked.emit();
  }

  onMouseEnter(): void {
    this.mPs.publish(true,
      AlphaPrimeLabelComponent.SHOW_MESSAGE);
  }

  onMouseLeave(): void {
    this.mPs.publish(false,
      AlphaPrimeLabelComponent.SHOW_MESSAGE);
  }

}
