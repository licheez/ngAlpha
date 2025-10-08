import { AlphaSeverityEnum, AlphaEnumSeverity } from './alpha-severity-enum';

describe('AlphaSeverityEnum', () => {
  it('should have correct enum values', () => {
    expect(AlphaSeverityEnum.Ok).toBe(0);
    expect(AlphaSeverityEnum.Debug).toBe(1);
    expect(AlphaSeverityEnum.Info).toBe(2);
    expect(AlphaSeverityEnum.Warning).toBe(3);
    expect(AlphaSeverityEnum.Error).toBe(4);
    expect(AlphaSeverityEnum.Fatal).toBe(5);
  });
});

describe('AlphaEnumSeverity', () => {
  it('getCode should return correct code for each enum value', () => {
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Ok)).toBe('O');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Debug)).toBe('D');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Info)).toBe('I');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Warning)).toBe('W');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Error)).toBe('E');
    expect(AlphaEnumSeverity.getCode(AlphaSeverityEnum.Fatal)).toBe('F');
  });

  it('getCode should throw on invalid enum value', () => {
    expect(() => AlphaEnumSeverity.getCode(999 as AlphaSeverityEnum)).toThrowError('invalid severityEnum value 999');
  });

  it('getValue should return correct enum for each code', () => {
    expect(AlphaEnumSeverity.getValue('O')).toBe(AlphaSeverityEnum.Ok);
    expect(AlphaEnumSeverity.getValue('D')).toBe(AlphaSeverityEnum.Debug);
    expect(AlphaEnumSeverity.getValue('I')).toBe(AlphaSeverityEnum.Info);
    expect(AlphaEnumSeverity.getValue('W')).toBe(AlphaSeverityEnum.Warning);
    expect(AlphaEnumSeverity.getValue('E')).toBe(AlphaSeverityEnum.Error);
    expect(AlphaEnumSeverity.getValue('F')).toBe(AlphaSeverityEnum.Fatal);
  });

  it('getValue should throw on invalid code', () => {
    expect(() => AlphaEnumSeverity.getValue('X')).toThrowError('invalid severityEnum code X');
  });
});

