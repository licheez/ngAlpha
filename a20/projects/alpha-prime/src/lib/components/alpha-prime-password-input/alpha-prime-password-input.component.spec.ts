import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaPrimePasswordInputComponent } from './alpha-prime-password-input.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

describe('AlphaPrimePasswordInputComponent', () => {
  let component: AlphaPrimePasswordInputComponent;
  let fixture: ComponentFixture<AlphaPrimePasswordInputComponent>;
  let mockAlphaPrimeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    mockAlphaPrimeService = jasmine.createSpyObj('AlphaPrimeService', ['generateRandomName']);
    mockAlphaPrimeService.generateRandomName.and.returnValue('test-random-name');

    await TestBed.configureTestingModule({
      imports: [AlphaPrimePasswordInputComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: mockAlphaPrimeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimePasswordInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Input Defaults', () => {
    it('should have default password as undefined', () => {
      expect(component.password()).toBeUndefined();
    });

    it('should have default disabled as false', () => {
      expect(component.disabled()).toBe(false);
    });

    it('should have default name from AlphaPrimeService', () => {
      expect(component.name()).toBe('test-random-name');
      expect(mockAlphaPrimeService.generateRandomName).toHaveBeenCalled();
    });

    it('should have default inputType as password', () => {
      expect(component.inputType()).toBe('password');
    });
  });

  describe('empty computed', () => {
    it('should return true when password is undefined', () => {
      component.password.set(undefined);
      expect(component.empty()).toBe(true);
    });

    it('should return true when password is empty string', () => {
      component.password.set('');
      expect(component.empty()).toBe(true);
    });

    it('should return true when password is whitespace only', () => {
      component.password.set('   ');
      expect(component.empty()).toBe(true);
    });

    it('should return false when password has content', () => {
      component.password.set('MyPassword123');
      expect(component.empty()).toBe(false);
    });
  });

  describe('onShowHide', () => {
    it('should toggle inputType from password to text', () => {
      component.inputType.set('password');
      component.onShowHide();
      expect(component.inputType()).toBe('text');
    });

    it('should toggle inputType from text to password', () => {
      component.inputType.set('text');
      component.onShowHide();
      expect(component.inputType()).toBe('password');
    });

    it('should toggle back and forth multiple times', () => {
      expect(component.inputType()).toBe('password');
      component.onShowHide();
      expect(component.inputType()).toBe('text');
      component.onShowHide();
      expect(component.inputType()).toBe('password');
      component.onShowHide();
      expect(component.inputType()).toBe('text');
    });
  });

  describe('onPasswordChanged', () => {
    it('should update password signal when called', () => {
      component.onPasswordChanged('NewPassword');
      expect(component.password()).toBe('NewPassword');
    });

    it('should handle empty string', () => {
      component.onPasswordChanged('');
      expect(component.password()).toBe('');
    });

    it('should update empty computed when password changes', () => {
      component.onPasswordChanged('HasContent');
      expect(component.empty()).toBe(false);

      component.onPasswordChanged('');
      expect(component.empty()).toBe(true);
    });
  });

  describe('Template Rendering', () => {
    it('should render input with correct type attribute', () => {
      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.type).toBe('password');
    });

    it('should change input type when toggled', () => {
      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;

      component.onShowHide();
      fixture.detectChanges();

      expect(input.type).toBe('text');
    });

    it('should render input with correct name attribute', async () => {
      fixture.componentRef.setInput('name', 'custom-name');
      fixture.detectChanges();
      await fixture.whenStable();

      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.name).toBe('custom-name');
    });

    it('should render input with maxlength attribute', () => {
      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.maxLength).toBe(50);
    });

    it('should disable input when disabled is true', async () => {
      fixture.componentRef.setInput('disabled', true);
      fixture.detectChanges();
      await fixture.whenStable();

      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBe(true);
    });

    it('should enable input when disabled is false', () => {
      fixture.componentRef.setInput('disabled', false);
      fixture.detectChanges();

      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.disabled).toBe(false);
    });
  });

  describe('Toggle Button', () => {
    it('should render toggle button', () => {
      const button: DebugElement = fixture.debugElement.query(By.css('p-button'));
      expect(button).toBeTruthy();
    });

    it('should disable button when password is empty', () => {
      component.password.set('');
      fixture.detectChanges();

      const button: DebugElement = fixture.debugElement.query(By.css('p-button'));
      expect(button.componentInstance.disabled).toBe(true);
    });

    it('should enable button when password has content', () => {
      component.password.set('SomePassword');
      fixture.detectChanges();

      const button: DebugElement = fixture.debugElement.query(By.css('p-button'));
      expect(button.componentInstance.disabled).toBe(false);
    });

    it('should show eye icon when input type is password', () => {
      component.inputType.set('password');
      fixture.detectChanges();

      const button: DebugElement = fixture.debugElement.query(By.css('p-button'));
      expect(button.componentInstance.icon).toBe('fa fa-eye');
    });

    it('should show eye-slash icon when input type is text', () => {
      component.inputType.set('text');
      fixture.detectChanges();

      const button: DebugElement = fixture.debugElement.query(By.css('p-button'));
      expect(button.componentInstance.icon).toBe('fa fa-eye-slash');
    });

    it('should have aria-label for show password when type is password', () => {
      component.inputType.set('password');
      fixture.detectChanges();

      const button: HTMLElement = fixture.debugElement.query(By.css('p-button')).nativeElement;
      expect(button.getAttribute('aria-label')).toBe('Show password');
    });

    it('should have aria-label for hide password when type is text', () => {
      component.inputType.set('text');
      fixture.detectChanges();

      const button: HTMLElement = fixture.debugElement.query(By.css('p-button')).nativeElement;
      expect(button.getAttribute('aria-label')).toBe('Hide password');
    });

    it('should have aria-pressed false when type is password', () => {
      component.inputType.set('password');
      fixture.detectChanges();

      const button: HTMLElement = fixture.debugElement.query(By.css('p-button')).nativeElement;
      expect(button.getAttribute('aria-pressed')).toBe('false');
    });

    it('should have aria-pressed true when type is text', () => {
      component.inputType.set('text');
      fixture.detectChanges();

      const button: HTMLElement = fixture.debugElement.query(By.css('p-button')).nativeElement;
      expect(button.getAttribute('aria-pressed')).toBe('true');
    });

    it('should call onShowHide when button is clicked', () => {
      spyOn(component, 'onShowHide');

      component.password.set('TestPassword');
      fixture.detectChanges();

      const button: DebugElement = fixture.debugElement.query(By.css('p-button'));
      button.nativeElement.click();

      expect(component.onShowHide).toHaveBeenCalled();
    });
  });

  describe('Integration Tests', () => {
    it('should update password through ngModelChange', () => {
      const input: DebugElement = fixture.debugElement.query(By.css('input'));

      input.triggerEventHandler('ngModelChange', 'UpdatedPassword');
      fixture.detectChanges();

      expect(component.password()).toBe('UpdatedPassword');
    });

    it('should reflect password changes in the view', async () => {
      component.password.set('ViewPassword');
      fixture.detectChanges();
      await fixture.whenStable();

      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;
      expect(input.value).toBe('ViewPassword');
    });

    it('should toggle visibility and update icon', () => {
      component.password.set('SecretPassword');
      fixture.detectChanges();

      const button: DebugElement = fixture.debugElement.query(By.css('p-button'));
      const input: HTMLInputElement = fixture.debugElement.query(By.css('input')).nativeElement;

      expect(input.type).toBe('password');
      expect(button.componentInstance.icon).toBe('fa fa-eye');

      component.onShowHide();
      fixture.detectChanges();

      expect(input.type).toBe('text');
      expect(button.componentInstance.icon).toBe('fa fa-eye-slash');
    });
  });
});
