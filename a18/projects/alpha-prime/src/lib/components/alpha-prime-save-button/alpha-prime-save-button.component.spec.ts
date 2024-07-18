import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeSaveButtonComponent } from './alpha-prime-save-button.component';
import {EventEmitter} from "@angular/core";
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {jest} from "@jest/globals";

describe('AlphaPrimeSaveButtonComponent', () => {
  let component: AlphaPrimeSaveButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeSaveButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeSaveButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeSaveButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.disabled).toBeFalsy();
    expect(component.clicked).toBeInstanceOf(EventEmitter);
    expect(component.caption).toContain('alpha.buttons.save');
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
    const component = new AlphaPrimeSaveButtonComponent(ps);
    component.onMouseEnter();
  });

  it('should handle mouseLeave', () => {
    const ps = {
      getTr: () => '',
      publish: (payload: boolean) => expect(payload).toBeFalsy()
    } as any as AlphaPrimeService;
    const component = new AlphaPrimeSaveButtonComponent(ps);
    component.onMouseLeave();
  });

});
