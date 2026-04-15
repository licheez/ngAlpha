import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlphaPrimeConfirmationModalComponent } from './alpha-prime-confirmation-modal.component';
import { AlphaPrimeService } from '../../services/alpha-prime.service';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';

describe('AlphaPrimeConfirmationModalComponent', () => {
  let component: AlphaPrimeConfirmationModalComponent;
  let fixture: ComponentFixture<AlphaPrimeConfirmationModalComponent>;

  const translations = new Map<string, string>([
    ['alpha.confirmationModal.message', 'default message'],
    ['alpha.confirmationModal.yes', 'Yes'],
    ['alpha.confirmationModal.no', 'No'],
    ['alpha.confirmationModal.title', 'Default Title']
  ]);

  const mockAlphaPrimeService: Partial<AlphaPrimeService> = {
    getTr: (key: string) => translations.get(key) ?? key
  };

  const mockDialogRef = jasmine.createSpyObj('DynamicDialogRef', ['close']);
  const mockDialogConfig: Partial<DynamicDialogConfig> = {
    data: {
      setInstance: jasmine.createSpy('setInstance')
    },
    header: undefined
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeConfirmationModalComponent],
      providers: [
        { provide: AlphaPrimeService, useValue: mockAlphaPrimeService },
        { provide: DynamicDialogRef, useValue: mockDialogRef },
        { provide: DynamicDialogConfig, useValue: mockDialogConfig }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeConfirmationModalComponent);
    component = fixture.componentInstance;
    // Do not call fixture.detectChanges() here to control lifecycle in tests
  });

  it('should create and set translations from service in constructor', () => {
    expect(component).toBeTruthy();
    // constructor already ran, translations assigned there
    expect(component.message).toBe('default message');
    expect(component.yes).toBe('Yes');
    expect(component.no).toBe('No');
  });

  it('ngOnInit calls mDdc.data.setInstance with the component', () => {
    // run lifecycle which triggers ngOnInit
    fixture.detectChanges();
    expect((mockDialogConfig.data as any).setInstance).toHaveBeenCalledWith(component);
  });

  it('init sets onClose and overrides message/yes/no and schedules header when title provided', fakeAsync(() => {
    const onCloseSpy = jasmine.createSpy('onClose');
    component.init(onCloseSpy, 'My Title', 'My Message', 'Y', 'N');

    // immediate effects
    expect(component.onClose).toBe(onCloseSpy);
    expect(component.message).toBe('My Message');
    expect(component.yes).toBe('Y');
    expect(component.no).toBe('N');

    // scheduled header set after 100ms
    tick(100);
    expect((mockDialogConfig as any).header).toBe('My Title');
  }));

  it('init sets header to default translation when title omitted', fakeAsync(() => {
    const onCloseSpy = jasmine.createSpy('onClose2');
    component.init(onCloseSpy); // no title provided

    // header should be set to translation after timeout
    tick(100);
    expect((mockDialogConfig as any).header).toBe('Default Title');
  }));

  it('onYes calls onClose(true) and closes the dialog with true', () => {
    const onCloseSpy = jasmine.createSpy('onCloseYes');
    component.onClose = onCloseSpy;

    component.onYes();

    expect(onCloseSpy).toHaveBeenCalledWith(true);
    expect(mockDialogRef.close).toHaveBeenCalledWith(true);
  });

  it('onNo calls onClose(false) and closes the dialog with false', () => {
    const onCloseSpy = jasmine.createSpy('onCloseNo');
    component.onClose = onCloseSpy;

    component.onNo();

    expect(onCloseSpy).toHaveBeenCalledWith(false);
    expect(mockDialogRef.close).toHaveBeenCalledWith(false);
  });
});
