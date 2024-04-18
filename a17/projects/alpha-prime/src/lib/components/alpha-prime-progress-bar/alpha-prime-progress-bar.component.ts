import {Component, Input} from '@angular/core';
import {ProgressBarModule} from "primeng/progressbar";
import {NgIf} from "@angular/common";

@Component({
  selector: 'alpha-prime-progress-bar',
  standalone: true,
  imports: [
    ProgressBarModule,
    NgIf
  ],
  templateUrl: './alpha-prime-progress-bar.component.html',
  styleUrl: './alpha-prime-progress-bar.component.css'
})
export class AlphaPrimeProgressBarComponent {

  private tOut: any | undefined;
  private _busy = false;

  @Input()
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

  @Input() delay = 2000;
  @Input() value = 100;
  @Input() mode: 'determinate' | 'indeterminate' | 'tiny' = 'indeterminate';

  private showProgressBar(): void {
    // start showing (directly or after a short delay)
    if (this.mode === 'determinate') {
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
        }, this.delay);
    }
  }

  private hideProgressBar(): void {
    this._busy = false;
  }

}
