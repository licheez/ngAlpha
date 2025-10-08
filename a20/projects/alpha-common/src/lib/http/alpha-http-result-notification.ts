import {AlphaEnumSeverity, AlphaSeverityEnum} from "./alpha-severity-enum";

export interface DsoAlphaHttpResultNotification {
  message: string;
  severityCode: string;
}

export interface IAlphaHttpResultNotification {
  severity: AlphaSeverityEnum;
  message: string;
}

export class AlphaHttpResultNotification implements IAlphaHttpResultNotification {
  message: string;
  severity: AlphaSeverityEnum;

  private constructor(item: IAlphaHttpResultNotification) {
    this.message = item.message;
    this.severity = item.severity;
  }

  static factorFromDso(dso: DsoAlphaHttpResultNotification): IAlphaHttpResultNotification {
    const item = {
      message: dso.message,
      severity: AlphaEnumSeverity.getValue(dso.severityCode)
    };
    return new AlphaHttpResultNotification(item);
  }

}
