import {Component, computed, EventEmitter, input, Output} from '@angular/core';
import {ButtonModule} from 'primeng/button';
import {TooltipModule} from 'primeng/tooltip';
import {AlphaPrimeService} from '../../services/alpha-prime.service';

@Component({
  standalone: true,
  selector: 'alpha-prime-cancel-button',
  imports: [
    ButtonModule,
    TooltipModule
  ],
  templateUrl: './alpha-prime-cancel-button.component.html',
  styleUrls: ['./alpha-prime-cancel-button.component.css']
})
export class AlphaPrimeCancelButtonComponent {

  disabled = input<boolean>(false);
  caption = input<string>('');
  effectiveCaption = computed(() =>
    this.caption() || this.mPs.getTr('alpha.buttons.add')
  );
  sm=input<boolean>(false);
  @Output() clicked = new EventEmitter<any>();

  constructor(private mPs: AlphaPrimeService) {
  }

  onClicked(): void {
    this.clicked.emit();
  }

}
