import {ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';

@Component({
  selector: 'alpha-prime-label',
  templateUrl: './alpha-prime-label.component.html',
  styleUrl: './alpha-prime-label.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    '[style.display]': '"block"'
  }
})
export class AlphaPrimeLabelComponent implements OnInit, OnDestroy {

  /** payload => show: boolean  */
  static readonly SHOW_MESSAGE = `AlphaPrimeLabelComponent.ShowMessage`;

  private readonly primeService = inject(AlphaPrimeService);

  caption = input('');
  value = input('dummy');
  invalid = input(false);

  isEmpty = computed(() => {
    const v = this.value();
    return (!v || v.trim() === '');
  });

  showMessage = signal(false);

  readonly requiredOrInvalidMessage: string;

  private showMessageSub = -1;

  constructor() {
    this.requiredOrInvalidMessage = this.primeService.getTr('alpha.label.requiredOrInvalid');
  }

  ngOnInit(): void {
    this.showMessageSub = this.primeService.subscribe(
      (show: boolean) => this.showMessage.set(show),
      AlphaPrimeLabelComponent.SHOW_MESSAGE);
  }

  ngOnDestroy(): void {
    this.primeService.unsubscribe(this.showMessageSub);
  }

}
