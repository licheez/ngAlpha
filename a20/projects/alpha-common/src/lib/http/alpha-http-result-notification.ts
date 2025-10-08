import {AlphaEnumSeverity, AlphaSeverityEnum} from "./alpha-severity-enum";

/**
 * Data structure for a notification in an HTTP result DSO.
 * Contains a message and a severity code as string.
 */
export interface DsoAlphaHttpResultNotification {
  message: string;
  severityCode: string;
}

/**
 * Interface for a notification in an HTTP result.
 * Contains a message and a typed severity enum value.
 */
export interface IAlphaHttpResultNotification {
  severity: AlphaSeverityEnum;
  message: string;
}

/**
 * Represents a notification in an HTTP result, with a message and severity.
 * Provides a factory method for creation from DSO objects.
 */
export class AlphaHttpResultNotification implements IAlphaHttpResultNotification {
  message: string;
  severity: AlphaSeverityEnum;

  /**
   * Constructs an AlphaHttpResultNotification instance.
   * @param item - The notification item with message and severity.
   */
  private constructor(item: IAlphaHttpResultNotification) {
    this.message = item.message;
    this.severity = item.severity;
  }

  /**
   * Factory method to create an AlphaHttpResultNotification from a DSO object.
   * Converts severityCode to AlphaSeverityEnum.
   * @param dso - The DSO notification object to convert.
   * @returns AlphaHttpResultNotification instance.
   */
  static factorFromDso(dso: DsoAlphaHttpResultNotification): IAlphaHttpResultNotification {
    const item = {
      message: dso.message,
      severity: AlphaEnumSeverity.getValue(dso.severityCode)
    };
    return new AlphaHttpResultNotification(item);
  }

}
