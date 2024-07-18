import { TestBed } from '@angular/core/testing';

import { AlphaPrimeLoginModalComponent } from './alpha-prime-login-modal.component';
import {DynamicDialogConfig, DynamicDialogRef} from "primeng/dynamicdialog";
import {AlphaPrimeLoginFormComponent} from "../alpha-prime-login-form/alpha-prime-login-form.component";
import {AlphaPrimeService} from "../../services/alpha-prime.service";

describe('AlphaPrimeLoginModalComponent', () => {
  let component: AlphaPrimeLoginModalComponent;
  let mockDdr: DynamicDialogRef;
  let mockDdc: DynamicDialogConfig;

  beforeEach(() => {
    jest.useFakeTimers();
    TestBed.configureTestingModule({
      providers: [
        AlphaPrimeLoginFormComponent,
        { provide: DynamicDialogRef, useValue: {
            close: () => {},
            destroy: () => {}
          } },
        { provide: DynamicDialogConfig, useValue: {
          data: { setInstance: (_: any) => {} } } },
        { provide: AlphaPrimeService, useValue: {
          getTr: (key: string) => key } }
      ]
    })
    const fixture =
      TestBed.createComponent(AlphaPrimeLoginModalComponent);
    mockDdr = TestBed.inject(DynamicDialogRef);
    mockDdc = TestBed.inject(DynamicDialogConfig);
    component = fixture.componentInstance;
  });

  afterEach(()=> {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('On initialization it should set the instance', () => {
    const spy = jest.spyOn(
      mockDdc.data, 'setInstance');
    component.ngOnInit();
    expect(spy).toHaveBeenCalledWith(component);
  });

  it ('should set the header', () => {
    component.ngOnInit();
    jest.advanceTimersByTime(100);
    expect(mockDdc.header).toEqual('alpha.loginModal.title');
  });

  it('should init', () => {
    const onClose = () => {};
    component.init(onClose);
    expect(component.onClose).toEqual(onClose);
    expect(component.ready).toBeTruthy();
  });

  it('should handle onLoggedIn', () => {
    component.init(()  => {});
    const spyOnClose = jest.spyOn(component, 'onClose');
    const spyDdrClose = jest.spyOn(mockDdr, 'close');
    component.onLoggedIn();
    expect(spyOnClose).toHaveBeenCalledWith(true);
    expect(spyDdrClose).toHaveBeenCalledWith(true);
  });

  it('should handle onCancelled', () => {
    component.init(()  => {});
    const spyOnClose = jest.spyOn(component, 'onClose');
    const spyDdrDestroy = jest.spyOn(mockDdr, 'destroy');
    component.onCancelled();
    expect(spyOnClose).toHaveBeenCalledWith(false);
    expect(spyDdrDestroy).toHaveBeenCalled();
  });

});
