import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeSubmitButtonComponent } from './alpha-prime-submit-button.component';
import {EventEmitter} from "@angular/core";
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {AlphaPrimeSaveButtonComponent} from "../alpha-prime-save-button/alpha-prime-save-button.component";

describe('AlphaPrimeSubmitButtonComponent', () => {
  let component: AlphaPrimeSubmitButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeSubmitButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeSubmitButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeSubmitButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.disabled).toBeFalsy();
    expect(component.clicked).toBeInstanceOf(EventEmitter);
    expect(component.caption).toContain('alpha.buttons.submit');
    expect(component.busy).toBeFalsy();
    expect(component.sm).toBeFalsy();
  });

  it('should handle onClicked', () => {
    const spy = jest.spyOn(component.clicked, 'emit');
    component.onClicked();
    expect(spy).toHaveBeenCalled();
  });

  it('should handle mouseEnter', () => {
    const ps = {
      getTr: () => '',
      publish: (payload: boolean) => expect(payload).toBeTruthy()
    } as any as AlphaPrimeService;
    const component =
      new AlphaPrimeSubmitButtonComponent(ps);
    component.onMouseEnter();
  });

  it('should handle mouseLeave', () => {
    const ps = {
      getTr: () => '',
      publish: (payload: boolean) => expect(payload).toBeFalsy()
    } as any as AlphaPrimeService;
    const component =
      new AlphaPrimeSubmitButtonComponent(ps);
    component.onMouseLeave();
  });


});
