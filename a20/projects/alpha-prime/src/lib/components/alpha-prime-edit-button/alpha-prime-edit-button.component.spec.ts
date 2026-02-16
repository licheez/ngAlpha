import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { AlphaPrimeEditButtonComponent } from './alpha-prime-edit-button.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeEditButtonComponent', () => {
  let component: AlphaPrimeEditButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeEditButtonComponent>;
  let mockPrimeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    mockPrimeService = jasmine.createSpyObj('AlphaPrimeService', ['getTr']);
    mockPrimeService.getTr.and.returnValue('tr:alpha.buttons.edit');

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeEditButtonComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: mockPrimeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Component Initialization', () => {
    it('should initialize with default values', () => {
      expect(component.disabled()).toBe(false);
      expect(component.caption()).toBe('');
      expect(component.sm()).toBe(false);
    });

    it('should have clicked EventEmitter', () => {
      expect(component.clicked).toBeInstanceOf(EventEmitter);
    });
  });

  describe('effectiveCaption computed signal', () => {
    it('should return translation when caption is empty', () => {
      fixture.detectChanges();
      expect(component.effectiveCaption()).toBe('tr:alpha.buttons.edit');
      expect(mockPrimeService.getTr).toHaveBeenCalledWith('alpha.buttons.edit');
    });

    it('should return custom caption when provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [AlphaPrimeEditButtonComponent],
        providers: [
          { provide: AlphaPrimeService, useValue: mockPrimeService }
        ]
      });
      fixture = TestBed.createComponent(AlphaPrimeEditButtonComponent);
      component = fixture.componentInstance;

      // Set caption input
      fixture.componentRef.setInput('caption', 'Edit Item');
      fixture.detectChanges();

      expect(component.effectiveCaption()).toBe('Edit Item');
    });

    it('should update when caption changes', () => {
      fixture.componentRef.setInput('caption', 'Edit First');
      fixture.detectChanges();
      expect(component.effectiveCaption()).toBe('Edit First');

      fixture.componentRef.setInput('caption', 'Edit Second');
      fixture.detectChanges();
      expect(component.effectiveCaption()).toBe('Edit Second');
    });

    it('should fallback to translation when caption is set to empty', () => {
      fixture.componentRef.setInput('caption', 'Custom Edit');
      fixture.detectChanges();
      expect(component.effectiveCaption()).toBe('Custom Edit');

      fixture.componentRef.setInput('caption', '');
      fixture.detectChanges();
      expect(component.effectiveCaption()).toBe('tr:alpha.buttons.edit');
    });
  });

  describe('Input Properties', () => {
    it('should accept disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });

    it('should accept and toggle disabled state', () => {
      expect(component.disabled()).toBe(false);

      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);

      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      expect(component.disabled()).toBe(false);
    });

    it('should accept sm input', () => {
      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();
      expect(component.sm()).toBe(true);
    });

    it('should accept and toggle sm state', () => {
      expect(component.sm()).toBe(false);

      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();
      expect(component.sm()).toBe(true);

      fixture.componentRef.setInput('sm', false);
      fixture.detectChanges();
      expect(component.sm()).toBe(false);
    });

    it('should accept caption input', () => {
      fixture.componentRef.setInput('caption', 'Custom Caption');
      fixture.detectChanges();
      expect(component.caption()).toBe('Custom Caption');
    });
  });

  describe('onClicked method', () => {
    it('should emit clicked event when called', () => {
      spyOn(component.clicked, 'emit');

      component.onClicked();

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should emit clicked event without arguments', () => {
      spyOn(component.clicked, 'emit');

      component.onClicked();

      expect(component.clicked.emit).toHaveBeenCalledWith();
    });

    it('should emit clicked multiple times when called multiple times', () => {
      spyOn(component.clicked, 'emit');

      component.onClicked();
      component.onClicked();
      component.onClicked();

      expect(component.clicked.emit).toHaveBeenCalledTimes(3);
    });
  });

  describe('Template Integration', () => {
    it('should apply small class when sm is true', () => {
      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();
      const pBtn = fixture.debugElement.query(By.css('p-button'));
      expect(pBtn.nativeElement.classList).toContain('p-button-sm');
    });

    it('should not apply small class when sm is false', () => {
      fixture.componentRef.setInput('sm', false);
      fixture.detectChanges();
      const pBtn = fixture.debugElement.query(By.css('p-button'));
      expect(pBtn.nativeElement.classList).not.toContain('p-button-sm');
    });

    it('should set disabled attribute when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('button'));
      expect(btn.nativeElement.disabled).toBeTrue();
    });

    it('should not set disabled attribute when disabled is false', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('button'));
      expect(btn.nativeElement.disabled).toBeFalse();
    });

    it('should emit clicked when button is clicked', () => {
      spyOn(component.clicked, 'emit');
      fixture.detectChanges();

      const pBtn = fixture.debugElement.query(By.css('p-button'));
      pBtn.triggerEventHandler('click', null);

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should have p-button element', () => {
      const pBtn = fixture.debugElement.query(By.css('p-button'));
      expect(pBtn).toBeTruthy();
    });
  });

  describe('Service Integration', () => {
    it('should call getTr with correct translation key', () => {
      // Create a fresh component to ensure getTr is called during initialization
      TestBed.resetTestingModule();
      const freshMockService = jasmine.createSpyObj('AlphaPrimeService', ['getTr']);
      freshMockService.getTr.and.returnValue('tr:alpha.buttons.edit');

      TestBed.configureTestingModule({
        imports: [AlphaPrimeEditButtonComponent],
        providers: [
          { provide: AlphaPrimeService, useValue: freshMockService }
        ]
      });

      const freshFixture = TestBed.createComponent(AlphaPrimeEditButtonComponent);
      const freshComponent = freshFixture.componentInstance;
      freshFixture.detectChanges();

      // Access effectiveCaption to trigger the computed signal
      freshComponent.effectiveCaption();

      expect(freshMockService.getTr).toHaveBeenCalledWith('alpha.buttons.edit');
    });

    it('should use custom caption without calling getTr', () => {
      TestBed.resetTestingModule();
      const freshMockService = jasmine.createSpyObj('AlphaPrimeService', ['getTr']);
      freshMockService.getTr.and.returnValue('tr:alpha.buttons.edit');

      TestBed.configureTestingModule({
        imports: [AlphaPrimeEditButtonComponent],
        providers: [
          { provide: AlphaPrimeService, useValue: freshMockService }
        ]
      });
      const freshFixture = TestBed.createComponent(AlphaPrimeEditButtonComponent);
      const freshComponent = freshFixture.componentInstance;

      freshFixture.componentRef.setInput('caption', 'Custom');
      freshFixture.detectChanges();

      // Access effectiveCaption - it should return custom value
      const result = freshComponent.effectiveCaption();

      expect(result).toBe('Custom');
      // getTr should not be called because caption is set
      expect(freshMockService.getTr).not.toHaveBeenCalled();
    });
  });
});
