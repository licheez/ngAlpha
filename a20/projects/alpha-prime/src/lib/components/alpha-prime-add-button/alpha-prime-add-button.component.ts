import {
  Component,
  Output,
  EventEmitter,
  input,
  computed
} from '@angular/core';
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

  disabled = input<boolean>(false);
  caption = input<string>('');
  effectiveCaption = computed(() =>
    this.caption() || this.mPs.getTr('alpha.buttons.add')
  );
  sm = input<boolean>(false);
  showLabel = input<boolean>(false);
  @Output() clicked = new EventEmitter<any>();

  constructor(private mPs: AlphaPrimeService) {
  }

  onClicked(): void {
    this.clicked.emit();
  }

}
