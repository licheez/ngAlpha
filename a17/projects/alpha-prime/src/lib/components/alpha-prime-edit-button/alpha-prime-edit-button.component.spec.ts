import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeEditButtonComponent } from './alpha-prime-edit-button.component';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {EventEmitter} from "@angular/core";
import {jest} from "@jest/globals";

describe('AlphaPrimeEditButtonComponent', () => {
  let component: AlphaPrimeEditButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeEditButtonComponent>;
  let mockAlphaPrimeService: Partial<AlphaPrimeService>;

  beforeEach(async () => {
    mockAlphaPrimeService = {
      getTr: jest.fn((key: string) => `tr_${key}`)
    };

    await TestBed.configureTestingModule({
      providers: [
        { provide: AlphaPrimeService, useValue: mockAlphaPrimeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeEditButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.disabled).toBeFalsy();
    expect(component.clicked).toBeInstanceOf(EventEmitter);
    expect(component.caption).toEqual('tr_alpha.buttons.edit');
    expect(component.sm).toBeFalsy();
  });

  it('should emit clicked event when clicked', () => {
      const emitSpy = jest.spyOn(component.clicked, 'emit');
      component.onClicked();
      expect(emitSpy).toHaveBeenCalled();
  });
});
