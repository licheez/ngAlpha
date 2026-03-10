import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { AlphaPrimeSelectComponent } from './alpha-prime-select.component';
import { AlphaPrimeSelectInfo, IAlphaPrimeSelectOption } from './alpha-prime-select-info';
import { AlphaPrimeService } from '../../services/alpha-prime.service';

describe('AlphaPrimeSelectComponent', () => {
  let component: AlphaPrimeSelectComponent;
  let fixture: ComponentFixture<AlphaPrimeSelectComponent>;

  const options: IAlphaPrimeSelectOption[] = [
    {
      id: '1',
      caption: 'c1',
      disabled: false,
      data: { info: 'i1' }
    },
    {
      id: '2',
      caption: 'c2',
      disabled: true,
      data: { info: 'i2' }
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeSelectComponent],
      providers: [AlphaPrimeService]
    }).compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeSelectComponent);
    component = fixture.componentInstance;
    localStorage.clear();
  });

  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
    expect(component.name().length).toBeGreaterThan(1);
  });

  it('should initialize options and optionId from asi', () => {
    const asi = AlphaPrimeSelectInfo.First(options);

    fixture.componentRef.setInput('asi', asi);
    fixture.detectChanges();

    expect(component.effectiveOptions()).toEqual(options);
    expect(component.optionId()).toBe('1');
  });

  it('should use direct options input when asi is undefined', () => {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();

    expect(component.effectiveOptions()).toEqual(options);
  });

  it('should update optionId and emit optionChange on onOptionChange', () => {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
    spyOn(component.optionChange, 'emit');

    component.onOptionChange('1');

    expect(component.optionId()).toBe('1');
    expect(component.optionChange.emit).toHaveBeenCalledWith(options[0]);
  });

  it('should write selected optionId to localStorage when asi has lsItemKey', () => {
    const asi = AlphaPrimeSelectInfo.LsOrNone(options, 'lsKey');

    fixture.componentRef.setInput('asi', asi);
    fixture.detectChanges();

    component.onOptionChange('2');

    expect(localStorage.getItem('lsKey')).toBe('2');
  });

  it('should remove localStorage key on clear when asi has lsItemKey', () => {
    const asi = AlphaPrimeSelectInfo.LsOrNone(options, 'lsKey');

    fixture.componentRef.setInput('asi', asi);
    fixture.detectChanges();

    component.onOptionChange('2');
    expect(localStorage.getItem('lsKey')).toBe('2');

    component.onClear();

    expect(localStorage.getItem('lsKey')).toBeNull();
  });

  it('should clear value and emit undefined option on onClear', () => {
    fixture.componentRef.setInput('options', options);
    fixture.detectChanges();
    spyOn(component.optionChange, 'emit');
    component.optionId.set('1');

    component.onClear();

    expect(component.optionId()).toBeUndefined();
    expect(component.optionChange.emit).toHaveBeenCalledWith(undefined);
  });

  it('should emit addClicked on onAdd', () => {
    spyOn(component.addClicked, 'emit');

    component.onAdd();

    expect(component.addClicked.emit).toHaveBeenCalled();
  });

  it('should show readonly input when readonly is true', () => {
    fixture.componentRef.setInput('readonly', true);
    fixture.componentRef.setInput('readonlyCaption', 'Read only value');
    fixture.detectChanges();

    const input = fixture.debugElement.query(By.css('input[pInputText]'));
    const dropdown = fixture.debugElement.query(By.css('p-select'));

    expect(input).toBeTruthy();
    expect(input.nativeElement.value).toBe('Read only value');
    expect(dropdown).toBeNull();
  });

  it('should show clear button only when optionId is set and showClear is true', () => {
    fixture.componentRef.setInput('options', options);
    fixture.componentRef.setInput('showClear', true);
    component.optionId.set('1');
    fixture.detectChanges();

    const clearButton = fixture.debugElement.query(By.css('.alpha-prime-select__clear'));
    expect(clearButton).toBeTruthy();

    component.optionId.set(undefined);
    fixture.detectChanges();
    expect(fixture.debugElement.query(By.css('.alpha-prime-select__clear'))).toBeNull();
  });

  it('should prefer placeholder over placeHolder alias when both are set', () => {
    fixture.componentRef.setInput('placeholder', 'Modern');
    fixture.componentRef.setInput('placeHolder', 'Legacy');
    fixture.detectChanges();

    expect(component.effectivePlaceholder()).toBe('Modern');
  });

  it('should fallback to placeHolder alias when placeholder is empty', () => {
    fixture.componentRef.setInput('placeholder', '');
    fixture.componentRef.setInput('placeHolder', 'Legacy');
    fixture.detectChanges();

    expect(component.effectivePlaceholder()).toBe('Legacy');
  });
});
