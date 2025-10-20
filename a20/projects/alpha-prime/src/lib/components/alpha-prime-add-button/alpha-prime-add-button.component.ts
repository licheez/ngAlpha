import { Component, Input, Output, EventEmitter } from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {AlphaPrimeService} from '../../services/alpha-prime.service';

@Component({
  selector: 'alpha-prime-add-button',
  standalone: true,
  templateUrl: './alpha-prime-add-button.component.html',
  imports: [
    ButtonModule,
    TooltipModule
  ],
  styleUrls: ['./alpha-prime-add-button.component.css']
})
export class AlphaPrimeAddButtonComponent {

  @Input() disabled = false;
  @Input() caption: string = '';
  @Input() sm = false;
  @Output() clicked = new EventEmitter<any>();

  constructor(private mPs: AlphaPrimeService) {
    this.caption = this.mPs.getTr('alpha.buttons.add');
  }

  onClicked(): void {
    this.clicked.emit();
  }

}
