import { Component, Input, Output, EventEmitter } from '@angular/core';
import {AlphaPrimeService} from "../alpha-prime.service";

@Component({
  selector: 'alpha-prime-add-button',
  templateUrl: './alpha-prime-add-button.component.html',
  styleUrls: ['./alpha-prime-add-button.component.css']
})
export class AlphaPrimeAddButtonComponent {

  @Input() disabled = false;
  @Input() caption = this.mPs.getTr('alpha.buttons.add');
  @Input() sm = false;
  @Output() clicked = new EventEmitter<any>();

  constructor(private mPs: AlphaPrimeService) { }

  onClicked(): void {
    this.clicked.emit();
  }

}
