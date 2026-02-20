import {ChangeDetectionStrategy, Component, computed, inject, input, OnDestroy, OnInit, signal} from '@angular/core';
import {AlphaPrimeService} from '../../services/alpha-prime.service';

@Component({
  selector: 'alpha-prime-label',
  standalone: true,
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
  invalidMessage = input<string | undefined>(undefined);

  private readonly isEmpty = computed(() => {
    const v = this.value();
    return (!v || v.trim() === '');
  });

  isEmptyOrInvalid = computed(() =>
    this.isEmpty() || this.invalid());

  showMessage = input(false);
  private _showMessage = signal(false);
  effectiveShowMessage = computed(() =>
    this._showMessage() || (this.showMessage()));

  readonly effectiveInvalidMessage = computed(() =>
    this.invalidMessage() ??
    this.primeService.getTr('alpha.label.requiredOrInvalid'));

  private showMessageSub = -1;

  constructor() {
  }


  ngOnInit(): void {
    this.showMessageSub = this.primeService.subscribe(
      (show: boolean) => this._showMessage.set(show),
      AlphaPrimeLabelComponent.SHOW_MESSAGE);
  }

  ngOnDestroy(): void {
    this.primeService.unsubscribe(this.showMessageSub);
  }

}
