import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeOkButtonComponent } from './alpha-prime-ok-button.component';
import {EventEmitter} from "@angular/core";

describe('AlphaPrimeOkButtonComponent', () => {
  let component: AlphaPrimeOkButtonComponent;
  let fixture: ComponentFixture<AlphaPrimeOkButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeOkButtonComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeOkButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.disabled).toBeFalsy();
    expect(component.clicked).toBeInstanceOf(EventEmitter);
    expect(component.caption).toContain('alpha.buttons.ok');
    expect(component.sm).toBeFalsy();
  });

  it('should handle onClick', () => {
    const spy = jest.spyOn(component.clicked, 'emit');
    component.onClicked();
    expect(spy).toHaveBeenCalled();
  });
});
