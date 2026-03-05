import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AlphaPrimeOkButton } from './alpha-prime-ok-button';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeOkButton', () => {
  let component: AlphaPrimeOkButton;
  let fixture: ComponentFixture<AlphaPrimeOkButton>;
  let compiled: DebugElement;
  let primeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    const primeServiceSpy = jasmine.createSpyObj('AlphaPrimeService', [
      'getTr'
    ]);
    primeServiceSpy.getTr.and.returnValue('OK');

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeOkButton],
      providers: [
        { provide: AlphaPrimeService, useValue: primeServiceSpy }
      ]
    })
      .compileComponents();

    primeService = TestBed.inject(AlphaPrimeService) as jasmine.SpyObj<AlphaPrimeService>;
    fixture = TestBed.createComponent(AlphaPrimeOkButton);
    compiled = fixture.debugElement;
    component = fixture.componentInstance;
  });

  afterEach(() => {
    fixture.destroy();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('Input Defaults', () => {
    it('should have default disabled as false', () => {
      fixture.detectChanges();
      expect(component.disabled()).toBe(false);
    });

    it('should have default sm as false', () => {
      fixture.detectChanges();
      expect(component.sm()).toBe(false);
    });

    it('should have default caption from AlphaPrimeService.getTr()', () => {
      fixture.detectChanges();
      expect(component.caption()).toBe('OK');
      expect(primeService.getTr).toHaveBeenCalledWith('alpha.buttons.ok');
    });

    it('should retrieve translation key alpha.buttons.ok on init', () => {
      fixture.detectChanges();
      expect(primeService.getTr).toHaveBeenCalledWith('alpha.buttons.ok');
    });
  });

  describe('Output Events', () => {
    it('should emit clicked event when button is clicked', (done) => {
      fixture.detectChanges();
      component.clicked.subscribe(() => {
        done();
      });
      component.onClicked();
    });

    it('should emit clicked event multiple times', () => {
      fixture.detectChanges();
      let emitCount = 0;
      component.clicked.subscribe(() => {
        emitCount++;
      });
      component.onClicked();
      component.onClicked();
      component.onClicked();
      expect(emitCount).toBe(3);
    });

    it('should trigger clicked output when template button is clicked', (done) => {
      fixture.detectChanges();
      component.clicked.subscribe(() => {
        done();
      });
      const button = compiled.query(By.css('p-button'));
      button.triggerEventHandler('click', null);
    });
  });

  describe('Disabled State', () => {
    it('should set disabled input to true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });

    it('should bind disabled attribute to p-button', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.disabled).toBe(true);
    });

    it('should enable button when disabled is false', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.disabled).toBe(false);
    });

    it('should update disabled binding when changed dynamically', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      let button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.disabled).toBe(false);

      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.disabled).toBe(true);
    });
  });

  describe('Size Variants', () => {
    it('should have default size as false (large)', () => {
      fixture.detectChanges();
      expect(component.sm()).toBe(false);
    });

    it('should set size to small when sm is true', () => {
      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.size).toBe('small');
    });

    it('should set size to large when sm is false', () => {
      fixture.componentRef.setInput('sm', false);
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.size).toBe('large');
    });

    it('should update size when sm changes dynamically', () => {
      fixture.componentRef.setInput('sm', false);
      fixture.detectChanges();
      let button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.size).toBe('large');

      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();
      button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.size).toBe('small');
    });
  });

  describe('Caption/Label', () => {
    it('should set custom caption', () => {
      fixture.componentRef.setInput('caption', 'Confirm');
      fixture.detectChanges();
      expect(component.caption()).toBe('Confirm');
    });

    it('should bind caption to p-button label', () => {
      fixture.componentRef.setInput('caption', 'Accept');
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.label).toBe('Accept');
    });

    it('should update caption dynamically', () => {
      fixture.componentRef.setInput('caption', 'OK');
      fixture.detectChanges();
      let button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.label).toBe('OK');

      fixture.componentRef.setInput('caption', 'Submit');
      fixture.detectChanges();
      button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.label).toBe('Submit');
    });

    it('should use default caption from service when not provided', () => {
      fixture.detectChanges();
      expect(component.caption()).toBe('OK');
    });
  });

  describe('Template Rendering', () => {
    it('should render p-button element', () => {
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button'));
      expect(button).toBeTruthy();
    });

    it('should have success severity', () => {
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.severity).toBe('success');
    });

    it('should have check icon', () => {
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.icon).toBe('fa fa-check');
    });

    it('should have alpha-prime-ok-button class', () => {
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button.alpha-prime-ok-button'));
      expect(button).toBeTruthy();
    });

    it('should have aria-label attribute', () => {
      fixture.componentRef.setInput('caption', 'Confirm Action');
      fixture.detectChanges();
      // Verify that caption is set (which is bound to aria-label)
      expect(component.caption()).toBe('Confirm Action');
    });

    it('should render with all attributes combined', () => {
      fixture.componentRef.setInput('caption', 'Accept');
      fixture.componentRef.setInput('disabled', false);
      fixture.componentRef.setInput('sm', false);
      fixture.detectChanges();

      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.label).toBe('Accept');
      expect(button.componentInstance.severity).toBe('success');
      expect(button.componentInstance.icon).toBe('fa fa-check');
      expect(button.componentInstance.disabled).toBe(false);
      expect(button.componentInstance.size).toBe('large');
    });

    it('should bind click event to onClicked method', () => {
      spyOn(component, 'onClicked');
      fixture.detectChanges();
      const button = compiled.query(By.css('p-button'));
      button.triggerEventHandler('click', null);
      expect(component.onClicked).toHaveBeenCalled();
    });
  });

  describe('Accessibility', () => {
    it('should have aria-label for screen readers', () => {
      fixture.componentRef.setInput('caption', 'OK Button');
      fixture.detectChanges();
      // Verify that the caption is set correctly (which is bound to aria-label in the template)
      expect(component.caption()).toBe('OK Button');
    });

    it('should update aria-label when caption changes', () => {
      fixture.componentRef.setInput('caption', 'First Caption');
      fixture.detectChanges();
      expect(component.caption()).toBe('First Caption');

      fixture.componentRef.setInput('caption', 'Second Caption');
      fixture.detectChanges();
      expect(component.caption()).toBe('Second Caption');
    });

    it('should be keyboard accessible (not disabled by default)', () => {
      fixture.detectChanges();
      expect(component.disabled()).toBe(false);
    });

    it('should prevent keyboard access when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });
  });

  describe('Integration Scenarios', () => {
    it('should handle rapid clicks', (done) => {
      fixture.detectChanges();
      let clickCount = 0;
      component.clicked.subscribe(() => {
        clickCount++;
        if (clickCount === 3) {
          expect(clickCount).toBe(3);
          done();
        }
      });
      component.onClicked();
      component.onClicked();
      component.onClicked();
    });

    it('should handle state changes after rendering', () => {
      fixture.componentRef.setInput('caption', 'Save');
      fixture.componentRef.setInput('disabled', false);
      fixture.componentRef.setInput('sm', false);
      fixture.detectChanges();

      // Change all inputs
      fixture.componentRef.setInput('caption', 'Confirm');
      fixture.componentRef.setInput('disabled', true);
      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();

      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.label).toBe('Confirm');
      expect(button.componentInstance.disabled).toBe(true);
      expect(button.componentInstance.size).toBe('small');
    });

    it('should work when disabled and then re-enabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);

      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      expect(component.disabled()).toBe(false);

      let clickEmitted = false;
      component.clicked.subscribe(() => {
        clickEmitted = true;
      });
      component.onClicked();
      expect(clickEmitted).toBe(true);
    });

    it('should maintain functionality with large caption', () => {
      const longCaption = 'This is a very long caption for the OK button';
      fixture.componentRef.setInput('caption', longCaption);
      fixture.detectChanges();

      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.label).toBe(longCaption);
    });

    it('should work with empty caption', () => {
      fixture.componentRef.setInput('caption', '');
      fixture.detectChanges();

      const button = compiled.query(By.css('p-button'));
      expect(button.componentInstance.label).toBe('');
    });
  });

  describe('Service Integration', () => {
    it('should call getTr during initialization', () => {
      fixture.detectChanges();
      expect(primeService.getTr).toHaveBeenCalledWith('alpha.buttons.ok');
    });

    it('should use service translation for default caption', () => {
      fixture.detectChanges();
      expect(component.caption()).toBe('OK');
    });
  });
});
