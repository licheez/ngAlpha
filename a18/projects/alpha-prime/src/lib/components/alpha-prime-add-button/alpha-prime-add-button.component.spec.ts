import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeAddButtonComponent } from './alpha-prime-add-button.component';
import {AlphaPrimeService} from "../../services/alpha-prime.service";
import {jest} from "@jest/globals";

describe('AlphaPrimeAddButtonComponent', () => {
  let component: AlphaPrimeAddButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeAddButtonComponent>;
  let service: AlphaPrimeService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeAddButtonComponent],
      providers: [AlphaPrimeService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeAddButtonComponent);
    component = fixture.componentInstance;
    service = TestBed.inject(AlphaPrimeService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit clicked event on onClicked call', () => {
    const spy = jest.spyOn(component.clicked, 'emit');
    component.onClicked();
    expect(spy).toHaveBeenCalled();
  });

  it('should correctly initialize the value of caption', () => {
    expect(component.caption).toEqual('');
  });

  it('should correctly initialize the value of sm', () => {
    expect(component.sm).toBe(false);
  });

  it('should correctly initialize the value of disabled as false', () => {
    expect(component.disabled).toBe(false);
  });


});
