import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlphaPrimeProgressBarComponent } from './alpha-prime-progress-bar.component';

describe('AlphaPrimeProgressBarComponent', () => {
  let component: AlphaPrimeProgressBarComponent;
  let fixture: ComponentFixture<AlphaPrimeProgressBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlphaPrimeProgressBarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlphaPrimeProgressBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  beforeEach(() => {
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  })

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component["_busy"]).toBeFalsy();
    expect(component.busy).toBeFalsy();
    expect(component['tOut']).toBeUndefined();
    expect(component.value).toEqual(100);
  });

  describe('handle show progress bar', () => {

    it('should handle show in determinate mode', () => {
      component['tOut'] = {};
      component.mode = 'determinate';
      component.busy = true;
      expect(component['_busy']).toBeTruthy();
      expect(component['tOut']).toBeUndefined();
    });

    it('should handle show in non determinate mode', () => {
      component['tOut'] = {};
      component.mode = 'indeterminate';
      component.busy = true;
      expect(component['_busy']).toBeFalsy();
      expect(component['tOut']).toBeDefined();
      jest.advanceTimersByTime(2000);
      expect(component.busy).toBeTruthy();
      expect(component['tOut']).toBeUndefined();
    });

  });

  it ('should handle hide', () => {
    component['tOut'] = {};
    component['_busy'] = true;
    component.busy = false;
    expect(component['_busy']).toBeFalsy();
    expect(component['tOut']).toBeUndefined();
  });

});
