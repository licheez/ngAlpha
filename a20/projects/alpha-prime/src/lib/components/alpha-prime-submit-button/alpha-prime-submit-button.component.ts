import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  input,
  output
} from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Tooltip } from 'primeng/tooltip';

import { AlphaPrimeService } from '../../services/alpha-prime.service';
import { AlphaPrimeLabelComponent } from '../alpha-prime-label/alpha-prime-label.component';

@Component({
  selector: 'alpha-prime-submit-button',
  standalone: true,
  imports: [
    ButtonDirective,
    Tooltip
  ],
  templateUrl: './alpha-prime-submit-button.component.html',
  styleUrl: './alpha-prime-submit-button.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'alpha-prime-submit-button'
  }
})
export class AlphaPrimeSubmitButtonComponent {
  private readonly mPs = inject(AlphaPrimeService);

  disabled = input(false);
  busy = input(false);
  sm = input(false);
  showLabel = input(false);
  caption = input(this.mPs.getTr('alpha.buttons.submit'));

  clicked = output<void>();

  publishMouseEvent = computed(() =>
    !(this.busy() || this.disabled()));

  onClicked(): void {
    this.clicked.emit();
  }

  onMouseEnter(): void {
    if (this.publishMouseEvent()) {
      this.mPs.publish(true, AlphaPrimeLabelComponent.SHOW_MESSAGE);
    }
  }

  onMouseLeave(): void {
    if (this.publishMouseEvent()) {
      this.mPs.publish(false, AlphaPrimeLabelComponent.SHOW_MESSAGE);
    }
  }
}
