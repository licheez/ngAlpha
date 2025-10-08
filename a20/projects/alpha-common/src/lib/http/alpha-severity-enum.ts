/**
 * Enum representing severity levels for API responses and notifications.
 * - Ok: Successful operation
 * - Debug: Debug information
 * - Info: Informational message
 * - Warning: Warning message
 * - Error: Error occurred
 * - Fatal: Fatal error occurred
 */
export enum AlphaSeverityEnum {
  Ok,
  Debug,
  Info,
  Warning,
  Error,
  Fatal
}

/**
 * Utility class for mapping AlphaSeverityEnum values to codes and vice versa.
 * Provides static methods for code conversion and value lookup.
 */
export class AlphaEnumSeverity {
  private static readonly Ok = 'O';
  private static readonly Debug = 'D';
  private static readonly Info = 'I';
  private static readonly Warning = 'W';
  private static readonly Error = 'E';
  private static readonly Fatal = 'F';

  /**
   * Gets the code string for a given AlphaSeverityEnum value.
   * @param value - The severity enum value.
   * @returns The corresponding code string.
   * @throws RangeError if the value is invalid.
   */
  static getCode (value: AlphaSeverityEnum): string {
    switch (value) {
      case AlphaSeverityEnum.Ok:
        return AlphaEnumSeverity.Ok;
      case AlphaSeverityEnum.Debug:
        return AlphaEnumSeverity.Debug;
      case AlphaSeverityEnum.Info:
        return AlphaEnumSeverity.Info;
      case AlphaSeverityEnum.Warning:
        return AlphaEnumSeverity.Warning;
      case AlphaSeverityEnum.Error:
        return AlphaEnumSeverity.Error;
      case AlphaSeverityEnum.Fatal:
        return AlphaEnumSeverity.Fatal;
      default:
        throw new RangeError ('invalid severityEnum value ' + value);
    }
  }

  /**
   * Gets the AlphaSeverityEnum value for a given code string.
   * @param code - The code string.
   * @returns The corresponding AlphaSeverityEnum value.
   * @throws RangeError if the code is invalid.
   */
  static getValue (code: string): AlphaSeverityEnum {
    switch (code) {
      case AlphaEnumSeverity.Ok:
        return AlphaSeverityEnum.Ok;
      case AlphaEnumSeverity.Debug:
        return AlphaSeverityEnum.Debug;
      case AlphaEnumSeverity.Info:
        return AlphaSeverityEnum.Info;
      case AlphaEnumSeverity.Warning:
        return AlphaSeverityEnum.Warning;
      case AlphaEnumSeverity.Error:
        return AlphaSeverityEnum.Error;
      case AlphaEnumSeverity.Fatal:
        return AlphaSeverityEnum.Fatal;
      default:
        throw new RangeError ('invalid severityEnum code ' + code);
    }
  }
}
