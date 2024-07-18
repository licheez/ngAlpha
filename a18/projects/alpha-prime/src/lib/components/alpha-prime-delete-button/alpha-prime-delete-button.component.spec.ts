import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeDeleteButtonComponent } from './alpha-prime-delete-button.component';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {AlphaPrimeModalService} from "../../services/alpha-prime-modal.service";
import {of} from "rxjs";
import {EventEmitter} from "@angular/core";

describe('AlphaPrimeDeleteButtonComponent', () => {
  let component: AlphaPrimeDeleteButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeDeleteButtonComponent>;
  let mockAlphaPrimeService;
  let mockAlphaPrimeModalService;

  beforeEach(async () => {

    mockAlphaPrimeService = {
      getTr: jest.fn((key: string) => `tr_${key}`)
    };

    const mockInit = (onClose:(confirmed: boolean)=>any) => onClose(true);
    const modal = { init: mockInit };

    mockAlphaPrimeModalService = {
      openModal: jest.fn().mockReturnValue(of(modal))
    };

    await TestBed.configureTestingModule({
      imports: [AlphaPrimeDeleteButtonComponent]
    })
    .compileComponents();

    TestBed.configureTestingModule({
      providers: [
        { provide: AlphaPrimeService, useValue: mockAlphaPrimeService },
        { provide: AlphaPrimeModalService, useValue: mockAlphaPrimeModalService }
      ]
    });

    fixture = TestBed.createComponent(AlphaPrimeDeleteButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.disabled).toBeFalsy();
    expect(component.busy).toBeFalsy();
    expect(component.clicked).toBeInstanceOf(EventEmitter);
    expect(component.caption).toEqual('tr_alpha.buttons.delete');
    expect(component.sm).toBeFalsy();
    expect(component.showConfirmationModal).toBeTruthy();
  });

  describe('onClick should handle events', ()=>{
    it('onClicked should emit when showConfirmationModal is false', () => {
      const spy = jest.spyOn(component.clicked, 'emit');
      component.showConfirmationModal = false;
      component.onClicked();
      expect(spy).toHaveBeenCalled();
    });
    it('onClicked should emit when showConfirmationModal is true', () => {
      const spy = jest.spyOn(component.clicked, 'emit');
      component.onClicked();
      expect(spy).toHaveBeenCalled();
    });

  });

});
