import { AlphaPrimeRemainingHeightDirective } from './alpha-prime-remaining-height.directive';
import {ElementRef} from "@angular/core";

describe('AlphaPrimeRemainingHeightDirective', () => {

  let directive: AlphaPrimeRemainingHeightDirective;
  let elementRefMock: ElementRef<HTMLDivElement>;

  beforeEach(() => {
    jest.useFakeTimers();
    elementRefMock = ({
      nativeElement: {
        getBoundingClientRect: jest.fn().mockReturnValue({ top: 10 }),
        style: {
          height: "",
        },
      },
    } as unknown) as ElementRef<HTMLDivElement>;

    directive = new AlphaPrimeRemainingHeightDirective(elementRefMock);
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe("ngOnInit", () => {
    it ('should setTimeout for addEventListener', () => {
      const eventListenerSpy =
        jest.spyOn(window, "addEventListener");
      directive.ngOnInit();
      jest.advanceTimersByTime(1);
      expect(eventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
      expect(elementRefMock.nativeElement.style.height)
        .toBe("758px");
    });
    it ('should setInterval', () => {
      directive.ngOnInit();
      jest.advanceTimersByTime(500);
      expect(elementRefMock.nativeElement.style.height)
        .toBe("758px");
    });
  });

  describe("ngOnDestroy", () => {
    it("should clear interval and remove event listener", () => {
      jest.useFakeTimers();
      const eventListenerSpy =
        jest.spyOn(window, "removeEventListener");
      const clearIntervalSpy =
        jest.spyOn(global, "clearInterval");

      directive.ngOnInit(); // To set interval
      directive.ngOnDestroy();

      expect(eventListenerSpy).toHaveBeenCalledWith(
        "resize",
        expect.any(Function)
      );
      expect(clearIntervalSpy).toHaveBeenCalledWith(expect.any(Number));
    });
  });


});
