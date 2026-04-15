import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlphaPrimeProgressBarComponent } from './alpha-prime-progress-bar.component';

describe('AlphaPrimeProgressBarComponent', () => {
  let component: AlphaPrimeProgressBarComponent;
  let fixture: ComponentFixture<AlphaPrimeProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeProgressBarComponent);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    // Clean up any pending timeouts
    if ((component as any).tOut) {
      clearTimeout((component as any).tOut);
    }
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.color()).toBeUndefined();
      expect(component.value()).toBe(100);
      expect(component.delay()).toBe(0);
      expect(component.mode()).toBe('indeterminate');
      expect(component.busy).toBe(false);
    });

    it('should have private _busy initialized to false', () => {
      expect((component as any)._busy).toBe(false);
    });

    it('should have tOut initialized to undefined', () => {
      expect((component as any).tOut).toBeUndefined();
    });
  });

  describe('Input Properties', () => {
    it('should accept color input', () => {
      fixture.componentRef.setInput('color', 'red');
      fixture.detectChanges();
      expect(component.color()).toBe('red');
    });

    it('should accept value input', () => {
      fixture.componentRef.setInput('value', 75);
      fixture.detectChanges();
      expect(component.value()).toBe(75);
    });

    it('should accept delay input', () => {
      fixture.componentRef.setInput('delay', 1000);
      fixture.detectChanges();
      expect(component.delay()).toBe(1000);
    });

    it('should accept mode input as determinate', () => {
      fixture.componentRef.setInput('mode', 'determinate');
      fixture.detectChanges();
      expect(component.mode()).toBe('determinate');
    });

    it('should accept mode input as tiny', () => {
      fixture.componentRef.setInput('mode', 'tiny');
      fixture.detectChanges();
      expect(component.mode()).toBe('tiny');
    });
  });

  describe('busy setter and getter', () => {
    it('should set busy to true immediately when mode is determinate', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'determinate');
      fixture.detectChanges();

      component.busy = true;

      expect(component.busy).toBe(true);
      expect((component as any)._busy).toBe(true);
    }));

    it('should set busy to false when setting busy to false', () => {
      component.busy = true;
      component.busy = false;

      expect(component.busy).toBe(false);
      expect((component as any)._busy).toBe(false);
    });

    it('should delay showing progress bar when mode is indeterminate', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('delay', 500);
      fixture.detectChanges();

      component.busy = true;

      // Should not be busy immediately
      expect((component as any)._busy).toBe(false);

      // After the delay, should be busy
      tick(500);
      expect((component as any)._busy).toBe(true);
    }));

    it('should delay showing progress bar when mode is tiny', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'tiny');
      fixture.componentRef.setInput('delay', 300);
      fixture.detectChanges();

      component.busy = true;

      // Should not be busy immediately
      expect((component as any)._busy).toBe(false);

      // After the delay, should be busy
      tick(300);
      expect((component as any)._busy).toBe(true);
    }));

    it('should clear timeout when setting busy to false before delay completes', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('delay', 1000);
      fixture.detectChanges();

      component.busy = true;
      expect((component as any).tOut).toBeDefined();

      // Set to false before delay completes
      component.busy = false;
      expect((component as any).tOut).toBeUndefined();
      expect((component as any)._busy).toBe(false);

      // Should not become busy after the delay
      tick(1000);
      expect((component as any)._busy).toBe(false);
    }));

    it('should clear timeout when setting busy to true again before previous delay completes', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('delay', 1000);
      fixture.detectChanges();

      component.busy = true;
      const firstTimeout = (component as any).tOut;
      expect(firstTimeout).toBeDefined();

      // Set to true again
      component.busy = true;
      const secondTimeout = (component as any).tOut;

      expect(secondTimeout).toBeDefined();
      expect(firstTimeout).not.toBe(secondTimeout);

      tick(1000);
      expect((component as any)._busy).toBe(true);
    }));

    it('should handle zero delay', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('delay', 0);
      fixture.detectChanges();

      component.busy = true;

      // With zero delay, should become busy immediately after tick
      tick(0);
      expect((component as any)._busy).toBe(true);
    }));
  });

  describe('showProgressBar method', () => {
    it('should show immediately in determinate mode', () => {
      fixture.componentRef.setInput('mode', 'determinate');
      fixture.detectChanges();

      (component as any).showProgressBar();

      expect((component as any)._busy).toBe(true);
      expect((component as any).tOut).toBeUndefined();
    });

    it('should set timeout in indeterminate mode', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('delay', 500);
      fixture.detectChanges();

      (component as any).showProgressBar();

      expect((component as any).tOut).toBeDefined();
      expect((component as any)._busy).toBe(false);

      tick(500);
      expect((component as any)._busy).toBe(true);
      expect((component as any).tOut).toBeUndefined();
    }));

    it('should set timeout in tiny mode', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'tiny');
      fixture.componentRef.setInput('delay', 200);
      fixture.detectChanges();

      (component as any).showProgressBar();

      expect((component as any).tOut).toBeDefined();
      expect((component as any)._busy).toBe(false);

      tick(200);
      expect((component as any)._busy).toBe(true);
      expect((component as any).tOut).toBeUndefined();
    }));
  });

  describe('hideProgressBar method', () => {
    it('should set _busy to false', () => {
      (component as any)._busy = true;

      (component as any).hideProgressBar();

      expect((component as any)._busy).toBe(false);
    });

    it('should hide progress bar regardless of mode', () => {
      fixture.componentRef.setInput('mode', 'determinate');
      (component as any)._busy = true;
      (component as any).hideProgressBar();
      expect((component as any)._busy).toBe(false);

      fixture.componentRef.setInput('mode', 'indeterminate');
      (component as any)._busy = true;
      (component as any).hideProgressBar();
      expect((component as any)._busy).toBe(false);

      fixture.componentRef.setInput('mode', 'tiny');
      (component as any)._busy = true;
      (component as any).hideProgressBar();
      expect((component as any)._busy).toBe(false);
    });
  });

  describe('Template Rendering', () => {
    it('should not render progress bar when busy is false', () => {
      component.busy = false;
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('p-progressBar');
      expect(progressBar).toBeNull();
    });

    it('should render indeterminate progress bar when mode is indeterminate and busy is true', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('delay', 0);
      fixture.detectChanges();

      component.busy = true;
      tick(0);
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('p-progressBar');
      expect(progressBar).toBeTruthy();
      expect(progressBar.getAttribute('mode')).toBe('indeterminate');
    }));

    it('should render determinate progress bar when mode is determinate and busy is true', () => {
      fixture.componentRef.setInput('mode', 'determinate');
      fixture.detectChanges();

      component.busy = true;
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('p-progressBar');
      expect(progressBar).toBeTruthy();
      expect(progressBar.getAttribute('mode')).toBe('determinate');
    });

    it('should render tiny progress bar when mode is tiny and busy is true', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'tiny');
      fixture.componentRef.setInput('delay', 0);
      fixture.detectChanges();

      component.busy = true;
      tick(0);
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('p-progressBar');
      expect(progressBar).toBeTruthy();
      expect(progressBar.getAttribute('mode')).toBe('determinate');
      expect(progressBar.classList.contains('p-pro')).toBe(true);
    }));

    it('should pass color to progress bar', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('color', 'blue');
      fixture.componentRef.setInput('delay', 0);
      fixture.detectChanges();

      component.busy = true;
      tick(0);
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('p-progressBar');
      expect(progressBar).toBeTruthy();
    }));

    it('should pass value to determinate progress bar', () => {
      fixture.componentRef.setInput('mode', 'determinate');
      fixture.componentRef.setInput('value', 50);
      fixture.detectChanges();

      component.busy = true;
      fixture.detectChanges();

      const progressBar = fixture.nativeElement.querySelector('p-progressBar');
      expect(progressBar).toBeTruthy();
    });
  });

  describe('Integration Tests', () => {
    it('should handle rapid busy state changes', fakeAsync(() => {
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('delay', 500);
      fixture.detectChanges();

      component.busy = true;
      tick(100);
      component.busy = false;
      tick(100);
      component.busy = true;
      tick(500);

      expect((component as any)._busy).toBe(true);
    }));

    it('should switch between modes correctly', fakeAsync(() => {
      // Start with determinate
      fixture.componentRef.setInput('mode', 'determinate');
      component.busy = true;
      fixture.detectChanges();
      expect((component as any)._busy).toBe(true);

      // Switch to indeterminate
      component.busy = false;
      fixture.componentRef.setInput('mode', 'indeterminate');
      fixture.componentRef.setInput('delay', 100);
      fixture.detectChanges();

      component.busy = true;
      expect((component as any)._busy).toBe(false);
      tick(100);
      expect((component as any)._busy).toBe(true);
    }));

    it('should handle value updates in determinate mode', () => {
      fixture.componentRef.setInput('mode', 'determinate');
      fixture.componentRef.setInput('value', 25);
      component.busy = true;
      fixture.detectChanges();

      expect(component.value()).toBe(25);

      fixture.componentRef.setInput('value', 75);
      fixture.detectChanges();

      expect(component.value()).toBe(75);
    });
  });
});
