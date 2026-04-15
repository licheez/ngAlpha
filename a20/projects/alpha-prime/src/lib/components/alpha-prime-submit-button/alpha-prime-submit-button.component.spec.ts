import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AlphaPrimeSubmitButtonComponent } from './alpha-prime-submit-button.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';
import { AlphaPrimeLabelComponent } from '../alpha-prime-label/alpha-prime-label.component';

describe('AlphaPrimeSubmitButtonComponent', () => {
  let component: AlphaPrimeSubmitButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeSubmitButtonComponent>;
  let primeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    primeService = jasmine.createSpyObj('AlphaPrimeService', ['getTr', 'publish']);
    primeService.getTr.and.returnValue('Submit');
    primeService.publish.and.returnValue(1);

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeSubmitButtonComponent],
      providers: [{ provide: AlphaPrimeService, useValue: primeService }]
    }).compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('defaults', () => {
    it('should initialize with expected default inputs', () => {
      expect(component.disabled()).toBeFalse();
      expect(component.busy()).toBeFalse();
      expect(component.sm()).toBeFalse();
      expect(component.showLabel()).toBeFalse();
      expect(component.caption()).toBe('Submit');
      expect(component.publishMouseEvent()).toBeTrue();
      expect(primeService.getTr).toHaveBeenCalledWith('alpha.buttons.submit');
    });
  });

  describe('template', () => {
    it('should render compact mode by default', () => {
      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList.contains('p-button-icon-only')).toBeTrue();
      expect(button.nativeElement.textContent.trim()).toBe('');
    });

    it('should render label mode when showLabel is true', () => {
      fixture.componentRef.setInput('showLabel', true);
      fixture.componentRef.setInput('caption', 'Submit form');
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      const label = fixture.debugElement.query(By.css('button span'));
      expect(button.nativeElement.classList.contains('p-button-icon-only')).toBeFalse();
      expect(label.nativeElement.textContent.trim()).toBe('Submit form');
    });

    it('should apply small class when sm is true', () => {
      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.classList.contains('p-button-sm')).toBeTrue();
    });

    it('should bind disabled attribute', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.disabled).toBeTrue();
    });

    it('should expose caption as aria-label', () => {
      fixture.componentRef.setInput('caption', 'Submit order');
      fixture.detectChanges();

      const button = fixture.debugElement.query(By.css('button'));
      expect(button.nativeElement.getAttribute('aria-label')).toBe('Submit order');
    });

    it('should show paper-plane icon when not busy', () => {
      fixture.componentRef.setInput('busy', false);
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('i.fa-paper-plane'));
      const spinner = fixture.debugElement.query(By.css('i.fa-spinner'));
      expect(icon).toBeTruthy();
      expect(spinner).toBeNull();
    });

    it('should show spinner icon when busy', () => {
      fixture.componentRef.setInput('busy', true);
      fixture.detectChanges();

      const icon = fixture.debugElement.query(By.css('i.fa-paper-plane'));
      const spinner = fixture.debugElement.query(By.css('i.fa-spinner.fa-spin'));
      expect(icon).toBeNull();
      expect(spinner).toBeTruthy();
    });
  });

  describe('events', () => {
    it('should emit clicked on onClicked()', () => {
      spyOn(component.clicked, 'emit');

      component.onClicked();

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should emit clicked when button is clicked', () => {
      spyOn(component.clicked, 'emit');

      const button = fixture.debugElement.query(By.css('button'));
      button.triggerEventHandler('click', {});

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should publish true on mouse enter when publish is enabled', () => {
      const wrapper = fixture.debugElement.query(By.css('span'));
      wrapper.triggerEventHandler('mouseenter', {});

      expect(primeService.publish).toHaveBeenCalledWith(true, AlphaPrimeLabelComponent.SHOW_MESSAGE);
    });

    it('should publish false on mouse leave when publish is enabled', () => {
      const wrapper = fixture.debugElement.query(By.css('span'));
      wrapper.triggerEventHandler('mouseleave', {});

      expect(primeService.publish).toHaveBeenCalledWith(false, AlphaPrimeLabelComponent.SHOW_MESSAGE);
    });

    it('should not publish mouse events when busy', () => {
      fixture.componentRef.setInput('busy', true);
      fixture.detectChanges();

      const wrapper = fixture.debugElement.query(By.css('span'));
      wrapper.triggerEventHandler('mouseenter', {});
      wrapper.triggerEventHandler('mouseleave', {});

      expect(component.publishMouseEvent()).toBeFalse();
      expect(primeService.publish).not.toHaveBeenCalled();
    });

    it('should not publish mouse events when disabled', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();

      const wrapper = fixture.debugElement.query(By.css('span'));
      wrapper.triggerEventHandler('mouseenter', {});
      wrapper.triggerEventHandler('mouseleave', {});

      expect(component.publishMouseEvent()).toBeFalse();
      expect(primeService.publish).not.toHaveBeenCalled();
    });
  });
});
