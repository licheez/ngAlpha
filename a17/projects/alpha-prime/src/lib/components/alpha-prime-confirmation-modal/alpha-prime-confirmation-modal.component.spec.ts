import { TestBed } from '@angular/core/testing';
import { AlphaPrimeConfirmationModalComponent } from './alpha-prime-confirmation-modal.component';
import { DynamicDialogRef, DynamicDialogConfig } from 'primeng/dynamicdialog';
import {AlphaPrimeService} from "../../services/alpha-prime.service";

describe('AlphaPrimeConfirmationModalComponent', () => {
  let component: AlphaPrimeConfirmationModalComponent;
  let mockDialogService: DynamicDialogRef;
  let mockDialogConfig: DynamicDialogConfig;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({
      // Provide both the component and the dependent service
      providers: [
        AlphaPrimeConfirmationModalComponent,
        { provide: DynamicDialogRef, useValue: {} },
        { provide: DynamicDialogConfig, useValue: { data: { setInstance: (_: any) => {} } } },
        { provide: AlphaPrimeService, useValue: {
          getTr: (key: string) => `tr_${key}` } }
      ]
    });

    component = TestBed.inject(AlphaPrimeConfirmationModalComponent);
    mockDialogService = TestBed.inject(DynamicDialogRef);
    mockDialogConfig = TestBed.inject(DynamicDialogConfig);
  });

  afterEach(()=> {
    jest.useRealTimers();
  });

  it('Should create AlphaPrimeConfirmationModalComponent', () => {
    expect(component).toBeTruthy();
  });

  it('On initialization it should set the instance', () => {
    jest.spyOn(mockDialogConfig.data, 'setInstance');
    component.ngOnInit();
    expect(mockDialogConfig.data.setInstance)
      .toHaveBeenCalledWith(component);
  });

  it('Upon selection of Yes, the onClose and close functions should be called with true', () => {
    mockDialogService.close = jest.fn();
    component.onClose = jest.fn();
    component.onYes();
    expect(component.onClose).toHaveBeenCalledWith(true);
    expect(mockDialogService.close).toHaveBeenCalledWith(true);
  });

  it('Upon selection of No, the onClose and close functions should be called with false', () => {
    mockDialogService.close = jest.fn();
    component.onClose = jest.fn();
    component.onNo();
    expect(component.onClose).toHaveBeenCalledWith(false);
    expect(mockDialogService.close).toHaveBeenCalledWith(false);
  });

  describe('init', () => {
    it ('should init w/o optional params', () => {
      const onClose = () => {};

      component.init(onClose);
      expect(component.onClose).toBe(onClose);
      expect(component.message).toBe('tr_alpha.confirmationModal.message');
      expect(component.yes).toBe("tr_alpha.confirmationModal.yes");
      expect(component.no).toBe("tr_alpha.confirmationModal.no");
      jest.runAllTimers();
      expect(component["mDdc"].header)
        .toBe("tr_alpha.confirmationModal.title");
    });

    it ('should init with optional params', () => {
      const onClose = () => {};

      component.init(onClose, 't', 'm', 'y', 'n');
      expect(component.onClose).toBe(onClose);
      expect(component.message).toBe('m');
      expect(component.yes).toBe("y");
      expect(component.no).toBe("n");
      jest.runAllTimers();
      expect(component["mDdc"].header).toBe("t");
    });

  });
});
