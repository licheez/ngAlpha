import { AlphaHttpResultNotification, DsoAlphaHttpResultNotification } from './alpha-http-result-notification';
import { AlphaSeverityEnum } from './alpha-severity-enum';

describe('AlphaHttpResultNotification', () => {
  it('should create an instance with correct severity and message', () => {
    const dso: DsoAlphaHttpResultNotification = {
      message: 'Test message',
      severityCode: 'E'
    };
    const result = AlphaHttpResultNotification.factorFromDso(dso);
    expect(result).toBeInstanceOf(AlphaHttpResultNotification);
    expect(result.message).toBe('Test message');
    expect(result.severity).toBe(AlphaSeverityEnum.Error);
  });

  it('should throw error for invalid severityCode', () => {
    const dso: DsoAlphaHttpResultNotification = {
      message: 'Test message',
      severityCode: 'X'
    };
    expect(() => AlphaHttpResultNotification.factorFromDso(dso))
      .toThrowError('invalid severityEnum code X');
  });
});

