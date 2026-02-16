import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EventEmitter } from '@angular/core';
import { By } from '@angular/platform-browser';
import { of } from 'rxjs';
import { AlphaPrimeDeleteButtonComponent } from './alpha-prime-delete-button.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';
import { AlphaPrimeModalService } from '../../services/alpha-prime-modal.service';
import { AlphaPrimeConfirmationModalComponent } from '../alpha-prime-confirmation-modal/alpha-prime-confirmation-modal.component';

describe('AlphaPrimeDeleteButtonComponent', () => {
  let component: AlphaPrimeDeleteButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeDeleteButtonComponent>;
  let mockPrimeService: jasmine.SpyObj<AlphaPrimeService>;
  let mockModalService: jasmine.SpyObj<AlphaPrimeModalService>;

  beforeEach(async () => {
    mockPrimeService = jasmine.createSpyObj('AlphaPrimeService', ['getTr']);
    mockPrimeService.getTr.and.returnValue('tr:alpha.buttons.add');

    mockModalService = jasmine.createSpyObj('AlphaPrimeModalService', ['openModal']);

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeDeleteButtonComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: mockPrimeService },
        { provide: AlphaPrimeModalService, useValue: mockModalService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeDeleteButtonComponent);
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
      expect(component.busy()).toBe(false);
      expect(component.showConfirmationModal()).toBe(true);
      expect(component.modalTitle()).toBeUndefined();
      expect(component.modalMessage()).toBeUndefined();
      expect(component.modalYes()).toBeUndefined();
      expect(component.modalNo()).toBeUndefined();
    });

    it('should have clicked EventEmitter', () => {
      expect(component.clicked).toBeInstanceOf(EventEmitter);
    });
  });

  describe('effectiveCaption computed signal', () => {
    it('should return translation when caption is empty', () => {
      fixture.detectChanges();
      expect(component.effectiveCaption()).toBe('tr:alpha.buttons.add');
      expect(mockPrimeService.getTr).toHaveBeenCalledWith('alpha.buttons.add');
    });

    it('should return custom caption when provided', () => {
      TestBed.resetTestingModule();
      TestBed.configureTestingModule({
        imports: [AlphaPrimeDeleteButtonComponent],
        providers: [
          { provide: AlphaPrimeService, useValue: mockPrimeService },
          { provide: AlphaPrimeModalService, useValue: mockModalService }
        ]
      });
      fixture = TestBed.createComponent(AlphaPrimeDeleteButtonComponent);
      component = fixture.componentInstance;

      // Set caption input
      fixture.componentRef.setInput('caption', 'Custom Delete');
      fixture.detectChanges();

      expect(component.effectiveCaption()).toBe('Custom Delete');
    });
  });

  describe('Input Properties', () => {
    it('should accept disabled input', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      expect(component.disabled()).toBe(true);
    });

    it('should accept sm input', () => {
      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();
      expect(component.sm()).toBe(true);
    });

    it('should accept busy input', () => {
      fixture.componentRef.setInput('busy', true);
      fixture.detectChanges();
      expect(component.busy()).toBe(true);
    });

    it('should accept showConfirmationModal input', () => {
      fixture.componentRef.setInput('showConfirmationModal', false);
      fixture.detectChanges();
      expect(component.showConfirmationModal()).toBe(false);
    });

    it('should accept modalTitle input', () => {
      fixture.componentRef.setInput('modalTitle', 'Delete Item');
      fixture.detectChanges();
      expect(component.modalTitle()).toBe('Delete Item');
    });

    it('should accept modalMessage input', () => {
      fixture.componentRef.setInput('modalMessage', 'Are you sure?');
      fixture.detectChanges();
      expect(component.modalMessage()).toBe('Are you sure?');
    });

    it('should accept modalYes input', () => {
      fixture.componentRef.setInput('modalYes', 'Delete');
      fixture.detectChanges();
      expect(component.modalYes()).toBe('Delete');
    });

    it('should accept modalNo input', () => {
      fixture.componentRef.setInput('modalNo', 'Cancel');
      fixture.detectChanges();
      expect(component.modalNo()).toBe('Cancel');
    });
  });

  describe('onClicked method', () => {
    it('should emit clicked event immediately when showConfirmationModal is false', () => {
      spyOn(component.clicked, 'emit');
      fixture.componentRef.setInput('showConfirmationModal', false);
      fixture.detectChanges();

      component.onClicked();

      expect(component.clicked.emit).toHaveBeenCalled();
      expect(mockModalService.openModal).not.toHaveBeenCalled();
    });

    it('should open confirmation modal when showConfirmationModal is true', () => {
      const mockModalInstance = {
        init: jasmine.createSpy('init')
      };
      mockModalService.openModal.and.returnValue(of(mockModalInstance));

      component.onClicked();

      expect(mockModalService.openModal).toHaveBeenCalledWith(
        AlphaPrimeConfirmationModalComponent,
        'AlphaDeleteButton',
        'AlphaConfirmation'
      );
    });

    it('should call modal.init with correct parameters', () => {
      const mockModalInstance = {
        init: jasmine.createSpy('init')
      };
      mockModalService.openModal.and.returnValue(of(mockModalInstance));

      fixture.componentRef.setInput('modalTitle', 'Delete Item');
      fixture.componentRef.setInput('modalMessage', 'Are you sure?');
      fixture.componentRef.setInput('modalYes', 'Yes, Delete');
      fixture.componentRef.setInput('modalNo', 'No, Cancel');
      fixture.detectChanges();

      component.onClicked();

      expect(mockModalInstance.init).toHaveBeenCalled();
      const initArgs = mockModalInstance.init.calls.mostRecent().args;
      expect(typeof initArgs[0]).toBe('function'); // callback function
      expect(initArgs[1]).toBe('Delete Item');
      expect(initArgs[2]).toBe('Are you sure?');
      expect(initArgs[3]).toBe('Yes, Delete');
      expect(initArgs[4]).toBe('No, Cancel');
    });

    it('should emit clicked event when user confirms in modal', () => {
      spyOn(component.clicked, 'emit');
      let confirmCallback: (confirmed: boolean) => void;

      const mockModalInstance = {
        init: jasmine.createSpy('init').and.callFake((callback: any) => {
          confirmCallback = callback;
        })
      };
      mockModalService.openModal.and.returnValue(of(mockModalInstance));

      component.onClicked();

      // Simulate user confirming
      confirmCallback!(true);

      expect(component.clicked.emit).toHaveBeenCalled();
    });

    it('should not emit clicked event when user cancels in modal', () => {
      spyOn(component.clicked, 'emit');
      let confirmCallback: (confirmed: boolean) => void;

      const mockModalInstance = {
        init: jasmine.createSpy('init').and.callFake((callback: any) => {
          confirmCallback = callback;
        })
      };
      mockModalService.openModal.and.returnValue(of(mockModalInstance));

      component.onClicked();

      // Simulate user canceling
      confirmCallback!(false);

      expect(component.clicked.emit).not.toHaveBeenCalled();
    });

    it('should pass undefined values when modal inputs are not set', () => {
      const mockModalInstance = {
        init: jasmine.createSpy('init')
      };
      mockModalService.openModal.and.returnValue(of(mockModalInstance));

      component.onClicked();

      expect(mockModalInstance.init).toHaveBeenCalled();
      const initArgs = mockModalInstance.init.calls.mostRecent().args;
      expect(initArgs[1]).toBeUndefined(); // modalTitle
      expect(initArgs[2]).toBeUndefined(); // modalMessage
      expect(initArgs[3]).toBeUndefined(); // modalYes
      expect(initArgs[4]).toBeUndefined(); // modalNo
    });
  });

  describe('Template Integration', () => {
    it('should apply small class when sm is true', () => {
      fixture.componentRef.setInput('sm', true);
      fixture.detectChanges();
      const pBtn = fixture.debugElement.query(By.css('p-button'));
      expect(pBtn.nativeElement.classList).toContain('p-button-sm');
    });

    it('should set disabled attribute when disabled is true', () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      const btn = fixture.debugElement.query(By.css('button'));
      expect(btn.nativeElement.disabled).toBeTrue();
    });
  });
});
