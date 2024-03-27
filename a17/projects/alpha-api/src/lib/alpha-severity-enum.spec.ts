import { describe, expect, it } from '@jest/globals';
import {AlphaEnumSeverity, AlphaSeverityEnum} from "./alpha-severity-enum";

describe('AlphaEnumSeverity Class', () => {
  it('Test getCode method for every AlphaSeverityEnum value', () => {
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Ok)).toEqual('O');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Debug)).toEqual('D');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Info)).toEqual('I');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Warning)).toEqual('W');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Error)).toEqual('E');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Fatal)).toEqual('F');
  });

  it('Test getCode method with invalid value, expecting RangeError', () => {
    let invalidValue = 9999;
    expect(() => AlphaEnumSeverity.getCode(invalidValue as AlphaSeverityEnum)).toThrow(RangeError);
  });

  it('Test getValue method for every AlphaSeverityEnum value', () => {
    expect(AlphaEnumSeverity.getValue('O')).toEqual(AlphaSeverityEnum.Ok);
    expect(AlphaEnumSeverity.getValue('D')).toEqual(AlphaSeverityEnum.Debug);
    expect(AlphaEnumSeverity.getValue('I')).toEqual(AlphaSeverityEnum.Info);
    expect(AlphaEnumSeverity.getValue('W')).toEqual(AlphaSeverityEnum.Warning);
    expect(AlphaEnumSeverity.getValue('E')).toEqual(AlphaSeverityEnum.Error);
    expect(AlphaEnumSeverity.getValue('F')).toEqual(AlphaSeverityEnum.Fatal);
  });

  it('Test getValue method with invalid value, expecting RangeError', () => {
    let invalidValue = 'Z';
    expect(() => AlphaEnumSeverity.getValue(invalidValue)).toThrow(RangeError);
  });
});
