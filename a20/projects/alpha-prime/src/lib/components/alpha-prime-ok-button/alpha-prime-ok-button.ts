import {Component, inject, input, output} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'alpha-prime-ok-button',
  standalone: true,
  imports: [
    Button,
    Tooltip
  ],
  templateUrl: './alpha-prime-ok-button.html',
  styleUrl: './alpha-prime-ok-button.css'
})
export class AlphaPrimeOkButton {
  private readonly mPs = inject(AlphaPrimeService);

  disabled = input<boolean>(false);
  clicked = output();
  caption = input<string>(this.mPs.getTr('alpha.buttons.ok'));
  sm = input<boolean>(false);
  showLabel = input<boolean>(false);

  onClicked(): void {
    this.clicked.emit();
  }
}
