import { TestBed } from '@angular/core/testing';

import { AlphaComService } from './alpha-com.service';

describe('AlphaComService', () => {
  let service: AlphaComService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlphaComService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('eon should return whether or not a string is null or empty', () => {
    let r = AlphaComService.eon('');
    expect(r).toBeTruthy();
    r = AlphaComService.eon('  ');
    expect(r).toBeTruthy();
    r = AlphaComService.eon(undefined);
    expect(r).toBeTruthy();
    r =  AlphaComService.eon('some info');
    expect(r).toBeFalsy();
  });

  it('isNull should return whether or not a variable is null', () => {
    let r = AlphaComService.isNull(null);
    expect(r).toBeTruthy();
    r = AlphaComService.isNull(undefined);
    expect(r).toBeTruthy();
  });

  it ('toNumberOrNull should convert string to number', () => {
    let r = AlphaComService.toNumberOrNull('');
    expect(r).toBeNull();
    r = AlphaComService.toNumberOrNull('10');
    expect(r).toEqual(10);
  });

  it ('contains checks it the searched string is found', () => {
    let r = AlphaComService.contains('Abc', 'b');
    expect(r).toBeTruthy();
    r = AlphaComService.contains('Abc', 'd');
    expect(r).toBeFalsy();
    r = AlphaComService.contains('Abc', 'a');
    expect(r).toBeFalsy();
  });

  it ('should compare ymd dates', () => {
    const d1 = new Date(2024, 0, 1);
    const d2 = new Date(2024, 0, 2);

    let r = AlphaComService.compareYmdDates(d1, d1);
    expect(r).toEqual(0);
    r = AlphaComService.compareYmdDates(d1, d2);
    expect(r).toBeLessThan(0);
    r = AlphaComService.compareYmdDates(d2, d1);
    expect(r).toBeGreaterThan(0);
  });

  it ('should format number local currency', () => {
    const r = AlphaComService.toLocaleCurrency(
      123.45, 'be');
    expect(r).toEqual('123,45 €');
  });

  it('should return rounded number without decimals if precision is not set', () => {
    const result = AlphaComService.round(1.2345);
    expect(result).toEqual(1);
  });

  it('should return rounded number with specified precision', () => {
    const result = AlphaComService.round(1.2345, 2);
    expect(result).toEqual(1.23);
  });

  it('should work correctly on negative numbers', () => {
    const result = AlphaComService.round(-1.2345, 2);
    expect(result).toEqual(-1.23);
  });

  it('should return original number if precision matches number of decimals', () => {
    const result = AlphaComService.round(1.23, 2);
    expect(result).toEqual(1.23);
  });

  it('should return zero if the input is zero regardless of precision', () => {
    const result = AlphaComService.round(0, 2);
    expect(result).toEqual(0);
  });

});
