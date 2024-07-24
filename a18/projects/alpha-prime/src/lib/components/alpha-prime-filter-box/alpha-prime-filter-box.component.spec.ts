import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeFilterBoxComponent } from './alpha-prime-filter-box.component';
import {EventEmitter} from "@angular/core";

describe('AlphaPrimeFilterBoxComponent', () => {
  let component: AlphaPrimeFilterBoxComponent;
  let fixture: ComponentFixture<AlphaPrimeFilterBoxComponent>;

  beforeEach(async () => {
    jest.useFakeTimers();
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeFilterBoxComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeFilterBoxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.delay).toEqual(300);
    expect(component.showAdd).toEqual(false);
    expect(component.term).toBeUndefined();
    expect(component.disabled).toBeFalsy();
    expect(component.placeholder).toEqual('');
    expect(component.termChange).toBeInstanceOf(EventEmitter);
    expect(component.addClicked).toBeInstanceOf(EventEmitter);
    expect(component.name).not.toBe('');
    expect(component.empty).toBeTruthy();
    expect(component.timer).toBeUndefined();
  });

  it ('should handle onTermChange', () => {
    const spy = jest.spyOn(component.termChange, 'emit');
    component.delay = 10;
    component.timer = setTimeout(() => {}, 1);
    const term = 'someTerm';
    component.onTermChanged(term);
    expect(component.term).toEqual(term)
    jest.advanceTimersByTime(10);
    expect(spy).toHaveBeenCalledWith(term);
  });

  it ('should handle onClear', () => {
    const spy = jest.spyOn(component.termChange, 'emit');
    component.onClear();
    expect(component.term).toEqual(undefined)
    expect(component.timer).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(undefined);
  });

  it ('should handle onAddClicked', () => {
    const spy = jest.spyOn(component.addClicked, 'emit');
    const term = 'someTerm';
    component.timer = setTimeout(() => {}, 1);
    component.term = term;
    component.onAddClicked();
    expect(component.timer).toBeUndefined();
    expect(spy).toHaveBeenCalledWith(term);
  });

});
