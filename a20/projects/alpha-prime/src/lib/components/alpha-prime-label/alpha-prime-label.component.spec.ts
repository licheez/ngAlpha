import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

import { AlphaPrimeLabelComponent } from './alpha-prime-label.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeLabelComponent', () => {
  let component: AlphaPrimeLabelComponent;
  let fixture: ComponentFixture<AlphaPrimeLabelComponent>;
  let compiled: DebugElement;
  let primeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    const primeServiceSpy = jasmine.createSpyObj('AlphaPrimeService', [
      'subscribe',
      'unsubscribe',
      'getTr'
    ]);
    primeServiceSpy.subscribe.and.returnValue(1);
    primeServiceSpy.getTr.and.returnValue('Field is required or invalid');

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeLabelComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: primeServiceSpy }
      ]
    })
    .compileComponents();

    primeService = TestBed.inject(AlphaPrimeService) as jasmine.SpyObj<AlphaPrimeService>;
    fixture = TestBed.createComponent(AlphaPrimeLabelComponent);
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
    it('should have default empty caption', () => {
      fixture.detectChanges();
      expect(component.caption()).toBe('');
    });

    it('should have default dummy value', () => {
      fixture.detectChanges();
      expect(component.value()).toBe('dummy');
    });

    it('should have default invalid as false', () => {
      fixture.detectChanges();
      expect(component.invalid()).toBe(false);
    });

    it('should have default invalidMessage as undefined', () => {
      fixture.detectChanges();
      expect(component.invalidMessage()).toBeUndefined();
    });

    it('should have default showMessage as false', () => {
      fixture.detectChanges();
      expect(component.showMessage()).toBe(false);
    });
  });

  describe('isEmpty computed', () => {
    it('should return true when value is empty string', () => {
      fixture.componentRef.setInput('value', '');
      fixture.detectChanges();
      expect(component['isEmpty']()).toBe(true);
    });

    it('should return true when value is whitespace only', () => {
      fixture.componentRef.setInput('value', '   ');
      fixture.detectChanges();
      expect(component['isEmpty']()).toBe(true);
    });

    it('should return false when value has content', () => {
      fixture.componentRef.setInput('value', 'test');
      fixture.detectChanges();
      expect(component['isEmpty']()).toBe(false);
    });
  });

  describe('isEmptyOrInvalid computed', () => {
    it('should return true when value is empty', () => {
      fixture.componentRef.setInput('value', '');
      fixture.detectChanges();
      expect(component.isEmptyOrInvalid()).toBe(true);
    });

    it('should return true when invalid is true', () => {
      fixture.componentRef.setInput('value', 'test');
      fixture.componentRef.setInput('invalid', true);
      fixture.detectChanges();
      expect(component.isEmptyOrInvalid()).toBe(true);
    });

    it('should return false when value has content and invalid is false', () => {
      fixture.componentRef.setInput('value', 'test');
      fixture.componentRef.setInput('invalid', false);
      fixture.detectChanges();
      expect(component.isEmptyOrInvalid()).toBe(false);
    });
  });

  describe('effectiveShowMessage computed', () => {
    it('should return false when both internal and input showMessage are false', () => {
      fixture.componentRef.setInput('showMessage', false);
      fixture.detectChanges();
      expect(component.effectiveShowMessage()).toBe(false);
    });

    it('should return true when input showMessage is true', () => {
      fixture.componentRef.setInput('showMessage', true);
      fixture.detectChanges();
      expect(component.effectiveShowMessage()).toBe(true);
    });

    it('should return true when internal _showMessage is set to true', () => {
      fixture.detectChanges();
      component['_showMessage'].set(true);
      fixture.detectChanges();
      expect(component.effectiveShowMessage()).toBe(true);
    });
  });

  describe('effectiveInvalidMessage computed', () => {
    it('should use provided invalidMessage when set', () => {
      fixture.componentRef.setInput('invalidMessage', 'Custom error');
      fixture.detectChanges();
      expect(component.effectiveInvalidMessage()).toBe('Custom error');
    });

    it('should use default translation when invalidMessage is undefined', () => {
      fixture.componentRef.setInput('invalidMessage', undefined);
      fixture.detectChanges();
      expect(component.effectiveInvalidMessage()).toBe('Field is required or invalid');
      expect(primeService.getTr).toHaveBeenCalledWith('alpha.label.requiredOrInvalid');
    });
  });

  describe('Template Rendering', () => {
    it('should render caption when provided', () => {
      fixture.componentRef.setInput('caption', 'Test Label');
      fixture.detectChanges();
      const captionElement = compiled.query(By.css('span'));
      expect(captionElement.nativeElement.textContent).toContain('Test Label');
    });

    it('should not render caption when empty', () => {
      fixture.componentRef.setInput('caption', '');
      fixture.detectChanges();
      const spans = compiled.queryAll(By.css('span'));
      const hasCaption = spans.some(span => span.nativeElement.textContent === '');
      expect(hasCaption).toBe(true);
    });

    it('should render invalid asterisk when isEmptyOrInvalid and not showMessage', () => {
      fixture.componentRef.setInput('value', '');
      fixture.componentRef.setInput('invalid', false);
      fixture.componentRef.setInput('showMessage', false);
      fixture.detectChanges();
      const invalidSpan = compiled.query(By.css('span.p-invalid'));
      expect(invalidSpan).toBeTruthy();
      expect(invalidSpan.nativeElement.textContent).toBe('*');
    });

    it('should not render invalid asterisk when showMessage is true', () => {
      fixture.componentRef.setInput('value', '');
      fixture.componentRef.setInput('invalid', false);
      fixture.componentRef.setInput('showMessage', true);
      fixture.detectChanges();
      const invalidSpan = compiled.query(By.css('span.p-invalid'));
      expect(invalidSpan).toBeFalsy();
    });

    it('should render error message when effectiveShowMessage and isEmptyOrInvalid', () => {
      fixture.componentRef.setInput('value', '');
      fixture.componentRef.setInput('invalidMessage', 'Test error');
      fixture.componentRef.setInput('showMessage', true);
      fixture.detectChanges();
      const errorSpan = compiled.query(By.css('span.font-bold'));
      expect(errorSpan).toBeTruthy();
      expect(errorSpan.nativeElement.textContent).toContain('Test error');
    });

    it('should not render error message when showMessage is false', () => {
      fixture.componentRef.setInput('value', '');
      fixture.componentRef.setInput('invalidMessage', 'Test error');
      fixture.componentRef.setInput('showMessage', false);
      fixture.detectChanges();
      const errorSpan = compiled.query(By.css('span.font-bold'));
      expect(errorSpan).toBeFalsy();
    });
  });

  describe('Lifecycle Hooks', () => {
    it('should subscribe to AlphaPrimeService on init', () => {
      fixture.detectChanges();
      expect(primeService.subscribe).toHaveBeenCalledWith(
        jasmine.any(Function),
        AlphaPrimeLabelComponent.SHOW_MESSAGE
      );
    });

    it('should update _showMessage when service broadcasts', () => {
      fixture.detectChanges();
      const callback = primeService.subscribe.calls.mostRecent().args[0] as (show: boolean) => void;
      callback(true);
      fixture.detectChanges();
      expect(component['_showMessage']()).toBe(true);
    });

    it('should unsubscribe from service on destroy', () => {
      fixture.detectChanges();
      fixture.destroy();
      expect(primeService.unsubscribe).toHaveBeenCalledWith(1);
    });
  });

  describe('ng-content projection', () => {
    it('should project content from parent component', () => {
      const testFixture = TestBed.createComponent(AlphaPrimeLabelComponent);
      testFixture.detectChanges();
      const contentSpan = testFixture.debugElement.query(By.css('span'));
      expect(contentSpan).toBeTruthy();
      testFixture.destroy();
    });
  });
});
