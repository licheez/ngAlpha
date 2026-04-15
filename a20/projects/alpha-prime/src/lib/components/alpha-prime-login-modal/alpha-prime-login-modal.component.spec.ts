import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AlphaPrimeLoginModalComponent } from './alpha-prime-login-modal.component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import { AlphaPrimeService } from '../../services/alpha-prime.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AlphaPrimeLoginModal', () => {
  let component: AlphaPrimeLoginModalComponent;
  let fixture: ComponentFixture<AlphaPrimeLoginModalComponent>;
  let mockDialogRef: jasmine.SpyObj<DynamicDialogRef>;
  let mockDialogConfig: DynamicDialogConfig;
  let mockAlphaPrimeService: jasmine.SpyObj<AlphaPrimeService>;

  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('DynamicDialogRef', ['close', 'destroy']);
    mockDialogConfig = {
      data: {
        setInstance: jasmine.createSpy('setInstance')
      },
      header: ''
    };
    mockAlphaPrimeService = jasmine.createSpyObj('AlphaPrimeService', [
      'getTr'
    ]);
    mockAlphaPrimeService.getTr.and.callFake((key: string) => {
      const translations: { [key: string]: string } = {
        'alpha.loginModal.title': 'Login'
      };
      return translations[key] || key;
    });

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeLoginModalComponent],
      providers: [
        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig },
        { provide: AlphaPrimeService, useValue: mockAlphaPrimeService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeLoginModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with ready as false', () => {
    expect(component.ready()).toBe(false);
  });

  it('should call setInstance on DynamicDialogConfig.data during ngOnInit', () => {
    expect(mockDialogConfig.data.setInstance).toHaveBeenCalledWith(component);
  });

  it('should set header to translated title', (done) => {
    setTimeout(() => {
      expect(mockDialogConfig.header).toBe('Login');
      done();
    }, 150);
  });

  it('should set ready to true when init is called', () => {
    component.init(() => {});
    expect(component.ready()).toBe(true);
  });

  it('should call onClose callback when onLoggedIn is called', () => {
    const onCloseSpy = jasmine.createSpy('onClose');
    component.init(onCloseSpy);
    component.onLoggedIn();
    expect(onCloseSpy).toHaveBeenCalledWith(true);
  });

  it('should close dialog ref with true when onLoggedIn is called', () => {
    component.init(() => {});
    component.onLoggedIn();
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('should call onClose callback with false when onCancelled is called', () => {
    const onCloseSpy = jasmine.createSpy('onClose');
    component.init(onCloseSpy);
    component.onCancelled();
    expect(onCloseSpy).toHaveBeenCalledWith(false);
  });

  it('should destroy dialog ref when onCancelled is called', () => {
    component.init(() => {});
    component.onCancelled();
    expect(mockDialogRef.destroy).toHaveBeenCalled();
  });
});
