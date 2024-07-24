import {Directive, ElementRef, Input, OnDestroy, OnInit} from '@angular/core';

@Directive({
  selector: '[alphaPrimeRemainingHeight]',
  standalone: true
})
export class AlphaPrimeRemainingHeightDirective
  implements OnInit, OnDestroy {

  /** bottom margin in pixels (default value is 0) */
  @Input() bottomMarginInPx = 0;

  constructor(private elementRef: ElementRef<HTMLDivElement>) { }

  interval: any;

  private setElementHeight() {
    const native = this.elementRef.nativeElement;
    const rect = native.getBoundingClientRect();
    const spaceFromTop = window.innerHeight - rect.top - this.bottomMarginInPx;
    // console.log(`innerHeight: ${this._innerHeight} rectTop: ${rect.top}`);
    native.style.height = `${spaceFromTop}px`;
  }

  ngOnInit(): void {

    setTimeout(() => {
      window.addEventListener(
        'resize',
        this.setElementHeight.bind(this));
      this.setElementHeight();
    }, 1);

    this.interval = setInterval(() => {
      this.setElementHeight();
    }, 500);
  }

  ngOnDestroy(): void {
    window.removeEventListener(
      'resize',
      this.setElementHeight);
    if (this.interval) {
      clearInterval(this.interval);
    }
  }

}
