import {Component, Input, input} from '@angular/core';
import {ProgressBar} from 'primeng/progressbar';

@Component({
  selector: 'alpha-prime-progress-bar',
  standalone: true,
  imports: [
    ProgressBar
  ],
  templateUrl: './alpha-prime-progress-bar.component.html',
  styleUrl: './alpha-prime-progress-bar.component.css'
})
export class AlphaPrimeProgressBarComponent {

  private tOut: any | undefined;
  private _busy = false;

  color = input<string | undefined>();
  value = input<number>(100);
  delay = input<number>(0);
  mode= input<'determinate' | 'indeterminate' | 'tiny'>(
    'indeterminate');

  @Input({required:true})
  set busy(busy: boolean) {
    if (this.tOut){
      clearTimeout(this.tOut);
      this.tOut = undefined;
    }
    if (busy) {
      this.showProgressBar();
    } else {
      this.hideProgressBar();
    }
  }
  get busy(): boolean {
    return this._busy;
  }

  private showProgressBar(): void {
    // start showing (directly or after a short delay)
    if (this.mode() === 'determinate') {
      // we are in determinate mode.
      // there should be no delay
      this._busy = true;
    } else {
      // in other modes there should be a small
      // delay before activating the bar
      this.tOut = setTimeout(
        () => {
          this._busy = true;
          this.tOut = undefined;
        }, this.delay());
    }
  }

  private hideProgressBar(): void {
    this._busy = false;
  }

}
