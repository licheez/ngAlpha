import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AlphaPrimeScrollerComponent } from './alpha-prime-scroller.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeScrollerComponent', () => {
  let component: AlphaPrimeScrollerComponent<string>;
  let fixture: ComponentFixture<AlphaPrimeScrollerComponent<string>>;
  let alphaPrimeServiceSpy: jasmine.SpyObj<AlphaPrimeService>;

  let resizeObserverCallback: ResizeObserverCallback | undefined;
  let resizeObserverDisconnectSpy: jasmine.Spy;
  let originalResizeObserver: typeof ResizeObserver | undefined;

  function setContainerMetrics(metrics: {
    scrollTop: number;
    scrollHeight: number;
    clientHeight: number;
  }): HTMLDivElement {
    const container = fixture.debugElement.query(By.css('.scroller-container'))
      .nativeElement as HTMLDivElement;

    Object.defineProperty(container, 'scrollTop', {
      configurable: true,
      writable: true,
      value: metrics.scrollTop
    });
    Object.defineProperty(container, 'scrollHeight', {
      configurable: true,
      value: metrics.scrollHeight
    });
    Object.defineProperty(container, 'clientHeight', {
      configurable: true,
      value: metrics.clientHeight
    });

    return container;
  }

  beforeEach(async () => {
    alphaPrimeServiceSpy = jasmine.createSpyObj<AlphaPrimeService>('AlphaPrimeService', ['getTr']);
    alphaPrimeServiceSpy.getTr.and.returnValue('Translated loading');

    originalResizeObserver = globalThis.ResizeObserver;
    resizeObserverDisconnectSpy = jasmine.createSpy('disconnect');

    class MockResizeObserver {
      constructor(cb: ResizeObserverCallback) {
        resizeObserverCallback = cb;
      }

      observe(): void {
        // no-op for tests
      }

      disconnect(): void {
        resizeObserverDisconnectSpy();
      }
    }

    globalThis.ResizeObserver = MockResizeObserver as unknown as typeof ResizeObserver;

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeScrollerComponent],
      providers: [{ provide: AlphaPrimeService, useValue: alphaPrimeServiceSpy }]
    }).compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeScrollerComponent<string>);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    if (originalResizeObserver) {
      globalThis.ResizeObserver = originalResizeObserver;
    }
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  it('should use service translation when loadingMessage is not provided', () => {
    fixture.detectChanges();

    expect(component.effectiveLoadingMessage()).toBe('Translated loading');
    expect(alphaPrimeServiceSpy.getTr).toHaveBeenCalledWith('alpha.scroller.loading');
  });

  it('should prioritize custom loadingMessage over service translation', () => {
    fixture.componentRef.setInput('loadingMessage', 'Custom loading text');
    fixture.detectChanges();

    expect(component.effectiveLoadingMessage()).toBe('Custom loading text');
    expect(alphaPrimeServiceSpy.getTr).not.toHaveBeenCalled();
  });

  it('should compute visible rows and paddings from scroll position', () => {
    fixture.componentRef.setInput('itemHeight', 100);
    fixture.componentRef.setInput('bufferSize', 1);
    fixture.detectChanges();

    // Ensure deterministic viewport size regardless of DOM test environment.
    (component as any).containerHeight.set(200);
    component.addItems(['A', 'B', 'C', 'D', 'E']);
    setContainerMetrics({
      scrollTop: 100,
      clientHeight: 200,
      scrollHeight: 500
    });

    component.onScroll();

    expect(component.visibleRows().map(row => row.index)).toEqual([0, 1, 2, 3]);
    expect(component.paddingTop()).toBe(0);
    expect(component.paddingBottom()).toBe(100);
  });

  it('should emit scrolled with current scrollTop on scroll', () => {
    fixture.detectChanges();
    spyOn(component.scrolled, 'emit');

    setContainerMetrics({
      scrollTop: 42,
      clientHeight: 200,
      scrollHeight: 1000
    });

    component.onScroll();

    expect(component.scrolled.emit).toHaveBeenCalledWith(42);
  });

  it('should insert one item at top and keep new item first', () => {
    fixture.detectChanges();
    component.addItems(['B', 'C']);

    component.insertAtTop('A');

    expect(component.visibleRows().map(row => row.data)).toContain('A');
    expect(component.findIndex(item => item === 'A')).toBe(0);
  });

  it('should insert multiple items at top preserving input order', () => {
    fixture.detectChanges();
    component.addItems(['C', 'D']);

    component.insertAtTop(['A', 'B']);

    expect(component.findIndex(item => item === 'A')).toBe(0);
    expect(component.findIndex(item => item === 'B')).toBe(1);
  });

  it('should replace an item at index and support find', () => {
    fixture.detectChanges();
    component.addItems(['A', 'B', 'C']);

    const replaced = component.replaceAt(1, 'B2');

    expect(replaced).toBeTrue();
    expect(component.find(item => item === 'B2')).toBe('B2');
    expect(component.findIndex(item => item === 'B')).toBe(-1);
  });

  it('should emit loadMore once when entering near-bottom zone, then again after leaving and re-entering', () => {
    fixture.detectChanges();
    spyOn(component.loadMore, 'emit');

    component.addItems(Array.from({ length: 20 }, (_, index) => `Item ${index}`));

    setContainerMetrics({
      scrollTop: 550,
      clientHeight: 300,
      scrollHeight: 1000
    });
    component.onScroll();
    component.onScroll();

    setContainerMetrics({
      scrollTop: 350,
      clientHeight: 300,
      scrollHeight: 1000
    });
    component.onScroll();

    setContainerMetrics({
      scrollTop: 550,
      clientHeight: 300,
      scrollHeight: 1000
    });
    component.onScroll();

    expect(component.loadMore.emit).toHaveBeenCalledTimes(2);
    expect(component.loadMore.emit).toHaveBeenCalledWith(20);
  });

  it('should not emit loadMore while loading is true', () => {
    fixture.detectChanges();
    spyOn(component.loadMore, 'emit');

    component.addItems(Array.from({ length: 10 }, (_, index) => `Item ${index}`));
    component.loading.set(true);

    setContainerMetrics({
      scrollTop: 550,
      clientHeight: 300,
      scrollHeight: 1000
    });

    component.onScroll();

    expect(component.loadMore.emit).not.toHaveBeenCalled();
  });

  it('should show loading indicator only when loading and showLoadingIndicator are true', () => {
    fixture.detectChanges();

    component.loading.set(true);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.scroller-loading'))).toBeTruthy();

    fixture.componentRef.setInput('showLoadingIndicator', false);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.scroller-loading'))).toBeNull();
  });

  it('should update container height on resize observer events with positive height', fakeAsync(() => {
    fixture.detectChanges();
    setContainerMetrics({
      scrollTop: 0,
      clientHeight: 320,
      scrollHeight: 320
    });

    component.ngAfterViewInit();

    expect((component as any).containerHeight()).toBe(320);

    const resizeEntry = {
      contentRect: { height: 450 }
    } as ResizeObserverEntry;

    resizeObserverCallback?.([resizeEntry], {} as ResizeObserver);
    expect((component as any).containerHeight()).toBe(450);

    const zeroHeightEntry = {
      contentRect: { height: 0 }
    } as ResizeObserverEntry;

    resizeObserverCallback?.([zeroHeightEntry], {} as ResizeObserver);
    expect((component as any).containerHeight()).toBe(450);

    tick(101);
  }));

  it('should disconnect resize observer on destroy', () => {
    fixture.detectChanges();

    component.ngOnDestroy();

    expect(resizeObserverDisconnectSpy).toHaveBeenCalled();
  });
});

