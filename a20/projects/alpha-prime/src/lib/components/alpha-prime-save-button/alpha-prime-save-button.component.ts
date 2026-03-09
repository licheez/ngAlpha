import {Component, inject, input, output, ChangeDetectionStrategy, computed} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {ButtonDirective} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';
import {AlphaPrimeLabelComponent} from '../alpha-prime-label/alpha-prime-label.component';

@Component({
  selector: 'alpha-prime-save-button',
  standalone: true,
  imports: [
    Tooltip,
    ButtonDirective
  ],
  templateUrl: './alpha-prime-save-button.component.html',
  styleUrl: './alpha-prime-save-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'alpha-prime-save-button'
  }
})
export class AlphaPrimeSaveButtonComponent {

  private readonly mPs = inject(AlphaPrimeService);

  disabled = input<boolean>(false);
  clicked = output();
  caption = input<string>(this.mPs.getTr('alpha.buttons.save'));
  busy = input<boolean>(false);
  sm = input<boolean>(false);
  showLabel = input<boolean>(false);

  publishMouseEvent = computed<boolean>(() =>
    !(this.busy() || this.disabled()));

  onClicked(): void {
    this.clicked.emit();
  }

  onMouseEnter(): void {
    if (this.publishMouseEvent()){
      this.mPs.publish(true, AlphaPrimeLabelComponent.SHOW_MESSAGE);
    }
  }

  onMouseLeave(): void {
    if (this.publishMouseEvent()){
      this.mPs.publish(false, AlphaPrimeLabelComponent.SHOW_MESSAGE);
    }
  }
}
