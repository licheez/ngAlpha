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
  private lastHeight = 0;

  private setElementHeight() {
    const native = this.elementRef.nativeElement;
    const rect = native.getBoundingClientRect();
    const spaceFromTop = window.innerHeight - rect.top - this.bottomMarginInPx;

    // Only update if height changed significantly (more than 1px difference)
    if (Math.abs(spaceFromTop - this.lastHeight) > 1) {
      native.style.height = `${spaceFromTop}px`;
      this.lastHeight = spaceFromTop;
    }
  }

  ngOnInit(): void {

    setTimeout(() => {
      window.addEventListener(
        'resize',
        this.setElementHeight.bind(this));
      this.setElementHeight();
    }, 1);

    // Check periodically (reduced frequency for better performance)
    this.interval = setInterval(() => {
      this.setElementHeight();
    }, 1000);
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
