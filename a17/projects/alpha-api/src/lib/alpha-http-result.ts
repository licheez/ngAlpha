import {AlphaEnumSeverity, AlphaSeverityEnum} from "./alpha-severity-enum";
import {AlphaEnumMutation, AlphaMutationEnum} from "./alpha-mutation-enum";
import {AlphaHttpResultNotification} from "./alpha-http-result-notification";

export class AlphaHttpResult {
  status: AlphaSeverityEnum;
  mutation: AlphaMutationEnum;
  notifications: AlphaHttpResultNotification[];
  hasMoreResults: boolean;
  get failure(): boolean {
    return this.status === AlphaSeverityEnum.Error
        || this.status === AlphaSeverityEnum.Fatal;
  }
  get success(): boolean {
    return !this.failure;
  }

  get message(): string {
    return this.notifications
      .map(n => n.message)
      .join(", ");
  }

  protected constructor(
    status: AlphaSeverityEnum,
    mutation: AlphaMutationEnum,
    notifications: AlphaHttpResultNotification[],
    hasMoreResults: boolean) {
    this.status = status;
    this.mutation = mutation;
    this.notifications = notifications;
    this.hasMoreResults = hasMoreResults;
  }

  static factorFromDso(dso:{
    statusCode: string,
    mutationCode: string,
    notifications: any[],
    hasMoreResults: boolean
    }): AlphaHttpResult {
    return new AlphaHttpResult(
      AlphaEnumSeverity.getValue(dso.statusCode),
      AlphaEnumMutation.getValue(dso.mutationCode),
      dso.notifications.map(
        (n: any) => AlphaHttpResultNotification.factorFromDso(n)),
      dso.hasMoreResults);
  }

}

export class AlphaHttpObjectResult<T> extends AlphaHttpResult {

  data: T;

  private constructor(
    status: AlphaSeverityEnum,
    mutation: AlphaMutationEnum,
    notifications: AlphaHttpResultNotification[],
    hasMoreResults: boolean,
    data: T) {
    super(status, mutation, notifications, hasMoreResults);
    this.data = data;
  }

  static override factorFromDso<T>(
    dso: any,
    factor?: (dsoData: any) => T): AlphaHttpObjectResult<T> {
    const data: T = dso.data == null
      ? null
      : factor ? factor(dso.data) : dso.data;
    return new AlphaHttpObjectResult<T>(
      AlphaEnumSeverity.getValue(dso.statusCode),
      AlphaEnumMutation.getValue(dso.mutationCode),
      dso.notifications.map(
        (n: any) => AlphaHttpResultNotification.factorFromDso(n)),
      dso.hasMoreResults,
      data);
  }

}

export class AlphaHttpListResult<T> extends AlphaHttpResult {
  data: T[];

  constructor(
    status: AlphaSeverityEnum,
    mutation: AlphaMutationEnum,
    notifications: AlphaHttpResultNotification[],
    hasMoreResults: boolean,
    data: T[]) {
    super(status, mutation, notifications, hasMoreResults);
    this.data = data;
  }

  static override factorFromDso<T>(
    dso: any,
    factor?: (dsoData: any) => T): AlphaHttpListResult<T> {

    const dsoList = dso.data as any[];
    const data: T[] = dsoList.map(
      (dsoListItem: any) => factor
        ? factor(dsoListItem)
        : dsoListItem);
    return new AlphaHttpListResult<T>(
      AlphaEnumSeverity.getValue(dso.statusCode),
      AlphaEnumMutation.getValue(dso.mutationCode),
      dso.notifications.map(
        (n: any) => AlphaHttpResultNotification.factorFromDso(n)),
      dso.hasMoreResults,
      data);
  }
}
