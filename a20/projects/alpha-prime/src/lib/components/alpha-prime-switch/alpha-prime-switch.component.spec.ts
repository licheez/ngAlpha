import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AlphaPrimeSwitchComponent } from './alpha-prime-switch.component';

describe('AlphaPrimeSwitchComponent', () => {
  let component: AlphaPrimeSwitchComponent;
  let fixture: ComponentFixture<AlphaPrimeSwitchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeSwitchComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeSwitchComponent);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  it('should create with expected defaults', () => {
    fixture.detectChanges();

    expect(component).toBeTruthy();
    expect(component.name().length).toBeGreaterThan(0);
    expect(component.disabled()).toBeFalse();
    expect(component.effectiveSwitchOption()).toEqual({ caption: '', id: '', selected: true });
  });

  it('should initialize selected value from localStorage when lsItemKey is provided', () => {
    localStorage.setItem('switch-key', 'true');
    const option = {
      id: 'id',
      caption: 'caption',
      selected: false,
      lsItemKey: 'switch-key'
    };

    fixture.componentRef.setInput('switchOption', option);
    fixture.detectChanges();

    expect(component.effectiveSwitchOption().selected).toBeTrue();
  });

  it('should update selected on onChange and persist to localStorage', () => {
    const option = {
      id: 'id',
      caption: 'caption',
      selected: false,
      lsItemKey: 'switch-key'
    };
    spyOn(component.switchOptionChange, 'emit');

    fixture.componentRef.setInput('switchOption', option);
    fixture.detectChanges();

    component.onChange({ checked: true });

    expect(component.effectiveSwitchOption().selected).toBeTrue();
    expect(component.switchOptionChange.emit).toHaveBeenCalledWith(jasmine.objectContaining({ selected: true }));
    expect(localStorage.getItem('switch-key')).toBe('true');
  });

  it('should toggle selected when caption is clicked', () => {
    const option = {
      id: 'id',
      caption: 'caption',
      selected: true
    };

    fixture.componentRef.setInput('switchOption', option);
    fixture.detectChanges();

    const caption = fixture.debugElement.query(By.css('span'));
    caption.triggerEventHandler('click', {});

    expect(component.effectiveSwitchOption().selected).toBeFalse();

    caption.triggerEventHandler('click', {});
    expect(component.effectiveSwitchOption().selected).toBeTrue();
  });

  it('should not toggle when disabled', () => {
    const option = {
      id: 'id',
      caption: 'caption',
      selected: true
    };

    fixture.componentRef.setInput('switchOption', option);
    fixture.componentRef.setInput('disabled', true);
    fixture.detectChanges();

    component.onCaptionClicked();

    expect(component.effectiveSwitchOption().selected).toBeTrue();
  });
});
