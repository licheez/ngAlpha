import { Component, Input, Output, EventEmitter } from '@angular/core';
import {AlphaPrimeService} from "../alpha-prime.service";

@Component({
  selector: 'alpha-add-button',
  templateUrl: './alpha-add-button.component.html',
  styleUrls: ['./alpha-add-button.component.css']
})
export class AlphaAddButtonComponent {

  @Input() disabled = false;
  @Input() caption = this.mPs.getTr('alpha.buttons.add');
  @Input() sm = false;
  @Output() clicked = new EventEmitter<any>();

  constructor(private mPs: AlphaPrimeService) { }

  onClicked(): void {
    this.clicked.emit();
  }

}
