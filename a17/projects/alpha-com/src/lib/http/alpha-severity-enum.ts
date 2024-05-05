export enum AlphaSeverityEnum {
  Ok,
  Debug,
  Info,
  Warning,
  Error,
  Fatal
}

export class AlphaEnumSeverity {
  private static readonly Ok = 'O';
  private static readonly Debug = 'D';
  private static readonly Info = 'I';
  private static readonly Warning = 'W';
  private static readonly Error = 'E';
  private static readonly Fatal = 'F';

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
