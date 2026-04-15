import {Component, computed, EventEmitter, input, Output} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';
import {Button} from 'primeng/button';
import {Tooltip} from 'primeng/tooltip';

@Component({
  selector: 'alpha-prime-edit-button',
  standalone: true,
  imports: [
    Button,
    Tooltip
  ],
  templateUrl: './alpha-prime-edit-button.component.html',
  styleUrl: './alpha-prime-edit-button.component.css'
})
export class AlphaPrimeEditButtonComponent {

  disabled = input<boolean>(false);
  caption = input<string>('');
  effectiveCaption = computed(() =>
    this.caption() || this.mPs.getTr('alpha.buttons.edit')
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
