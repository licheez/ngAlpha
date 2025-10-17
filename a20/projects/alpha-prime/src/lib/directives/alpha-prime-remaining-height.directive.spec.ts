import { AlphaPrimeRemainingHeightDirective } from './alpha-prime-remaining-height.directive';
import { ElementRef } from '@angular/core';
import { fakeAsync, tick } from '@angular/core/testing';

describe('AlphaPrimeRemainingHeightDirective', () => {
  let directive: AlphaPrimeRemainingHeightDirective;
  let elementRefMock: ElementRef<HTMLDivElement>;

  beforeEach(() => {
    // Ensure a consistent window innerHeight so the expected px value is stable
    (window as any).innerHeight = 768;

    elementRefMock = ({
      nativeElement: {
        getBoundingClientRect: () => ({ top: 10 }),
        style: {
          height: ''
        }
      }
    } as unknown) as ElementRef<HTMLDivElement>;

    directive = new AlphaPrimeRemainingHeightDirective(elementRefMock);
  });

  describe('ngOnInit', () => {
    it('should setTimeout for addEventListener', fakeAsync(() => {
      const eventListenerSpy = spyOn(window, 'addEventListener');

      directive.ngOnInit();

      // advance past the 1ms timeout
      tick(1);

      expect(eventListenerSpy).toHaveBeenCalledWith('resize', jasmine.any(Function));

      // computed height: 768 (innerHeight) - 10 (rect.top) - 0 (bottomMarginInPx) = 758
      expect(elementRefMock.nativeElement.style.height).toBe('758px');
    }));

    it('should setInterval', fakeAsync(() => {
      directive.ngOnInit();

      // advance enough time for the interval callback to run (500ms)
      tick(500);

      expect(elementRefMock.nativeElement.style.height).toBe('758px');
    }));
  });

  describe('ngOnDestroy', () => {
    it('should clear interval and remove event listener', fakeAsync(() => {
      const removeEventSpy = spyOn(window, 'removeEventListener');
      const clearIntervalSpy = spyOn(window as any, 'clearInterval');

      directive.ngOnInit(); // sets interval and schedules addEventListener
      tick(1); // ensure setTimeout ran so listener and interval exist

      directive.ngOnDestroy();

      expect(removeEventSpy).toHaveBeenCalledWith('resize', jasmine.any(Function));
      expect(clearIntervalSpy).toHaveBeenCalledWith(jasmine.any(Number));
    }));
  });
});
