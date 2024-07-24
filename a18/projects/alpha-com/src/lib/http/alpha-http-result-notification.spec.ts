import {AlphaHttpResultNotification, DsoAlphaHttpResultNotification} from "./alpha-http-result-notification";
import {AlphaSeverityEnum} from "./alpha-severity-enum";

describe('AlphaHttpResultNotification', () => {
  describe('factorFromDso', () => {
    it('should create an instance from a DSO object', () => {
      const dso: DsoAlphaHttpResultNotification = {
        message: 'Test Message',
        severityCode: 'E'
      };

      const result = AlphaHttpResultNotification
        .factorFromDso(dso);

      expect(result).toBeInstanceOf(AlphaHttpResultNotification);
      expect(result.severity).toEqual(AlphaSeverityEnum.Error);
      expect(result.message).toEqual('Test Message');
    });

    it('should throw an error if the severity code is invalid', () => {
      const dso: DsoAlphaHttpResultNotification = {
        message: 'Test Message',
        severityCode: 'Invalid'
      };

      expect(() => AlphaHttpResultNotification.factorFromDso(dso)).toThrowError();
    });
  });
});
