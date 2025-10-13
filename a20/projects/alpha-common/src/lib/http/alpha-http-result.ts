import {AlphaEnumSeverity, AlphaSeverityEnum} from "./alpha-severity-enum";
import {AlphaEnumMutation, AlphaMutationEnum} from "./alpha-mutation-enum";
import {AlphaHttpResultNotification} from "./alpha-http-result-notification";

// INTERFACES
/**
 * Data structure for a base HTTP result from the API.
 * Contains status, mutation, notifications, and pagination info.
 */
export interface IAlphaHttpResultDso {
  statusCode: string,
  mutationCode: string,
  notifications: any[],
  hasMoreResults: boolean
}

/**
 * Data structure for an HTTP result containing a single data object.
 * Extends IAlphaHttpResultDso with a data property.
 */
export interface IAlphaHttpObjectResultDso
  extends IAlphaHttpResultDso {
  data: any
}

/**
 * Data structure for an HTTP result containing a list of data objects.
 * Extends IAlphaHttpResultDso with a data array property.
 */
export interface IAlphaHttpListResultDso
  extends IAlphaHttpResultDso {
  data: any[]
}

// CONCRETES
/**
 * Represents a generic HTTP result from the API, including status, mutation, notifications, and pagination info.
 * Provides static methods for type checking and factory creation from DSO objects.
 */
export class AlphaHttpResult {
  status: AlphaSeverityEnum;
  mutation: AlphaMutationEnum;
  notifications: AlphaHttpResultNotification[];
  hasMoreResults: boolean;

  /**
   * Indicates if the result is a failure (Error or Fatal severity).
   */
  get failure(): boolean {
    return this.status === AlphaSeverityEnum.Error
        || this.status === AlphaSeverityEnum.Fatal;
  }

  /**
   * Indicates if the result is a success (not Error or Fatal severity).
   */
  get success(): boolean {
    return !this.failure;
  }

  /**
   * Concatenates all notification messages into a single string.
   */
  get message(): string {
    return this.notifications
      .map(n => n.message)
      .join(", ");
  }

  /**
   * Constructs an AlphaHttpResult instance.
   * @param status - Severity status of the result.
   * @param mutation - Mutation code of the result.
   * @param notifications - List of notifications.
   * @param hasMoreResults - Indicates if more results are available for pagination.
   */
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

  /**
   * Factory method to create an AlphaHttpResult from a DSO object.
   * @param dso - The data source object to convert.
   * @returns AlphaHttpResult instance.
   */
  static factorFromDso(dso:IAlphaHttpResultDso): AlphaHttpResult {
    return new AlphaHttpResult(
      AlphaEnumSeverity.getValue(dso.statusCode),
      AlphaEnumMutation.getValue(dso.mutationCode),
      dso.notifications.map(
        (n: any) => AlphaHttpResultNotification.factorFromDso(n)),
      dso.hasMoreResults);
  }

  /**
   * Checks if the given object matches the base result structure.
   * @param dso - The object to check.
   * @returns True if the object is a base result, false otherwise.
   */
  static isBaseResult(dso: any): boolean {
    if (dso == null) return false;
    const isObject = typeof dso === 'object';
    if (!isObject) return false;
    const hasStatusCode ='statusCode' in dso && typeof dso.statusCode === 'string';
    const hasMutationCode = 'mutationCode' in dso && typeof dso.mutationCode === 'string';
    const hasHasMoreResult ='hasMoreResults' in dso && typeof dso.hasMoreResults === 'boolean';
    const hasNotifications = 'notifications' in dso && Array.isArray(dso.notifications);
    return hasStatusCode
      && hasMutationCode
      && hasHasMoreResult
      && hasNotifications;
  }

  /**
   * Checks if the given object matches the object result structure (single data object).
   * @param dso - The object to check.
   * @returns True if the object is an object result, false otherwise.
   */
  static isObjectResult(dso: any): boolean {
    return AlphaHttpResult.isBaseResult(dso)
    && 'data' in dso && !Array.isArray(dso.data);
  }

  /**
   * Checks if the given object matches the list result structure (data array).
   * @param dso - The object to check.
   * @returns True if the object is a list result, false otherwise.
   */
  static isListResult(dso: any): boolean {
    return AlphaHttpResult.isBaseResult(dso)
      && 'data' in dso && Array.isArray(dso.data);
  }

}

/**
 * Represents an HTTP result containing a single data object.
 * Extends AlphaHttpResult and adds a typed data property.
 * Provides a factory method for creation from DSO objects.
 */
export class AlphaHttpObjectResult<T>
  extends AlphaHttpResult {

  data: T;

  /**
   * Constructs an AlphaHttpObjectResult instance.
   * @param status - Severity status of the result.
   * @param mutation - Mutation code of the result.
   * @param notifications - List of notifications.
   * @param hasMoreResults - Indicates if more results are available for pagination.
   * @param data - The single data object.
   */
  private constructor(
    status: AlphaSeverityEnum,
    mutation: AlphaMutationEnum,
    notifications: AlphaHttpResultNotification[],
    hasMoreResults: boolean,
    data: T) {
    super(status, mutation, notifications, hasMoreResults);
    this.data = data;
  }

  /**
   * Factory method to create an AlphaHttpObjectResult from a DSO object.
   * @param dso - The data source object to convert.
   * @param factor - Optional function to transform the data property.
   * @returns AlphaHttpObjectResult instance.
   */
  static override factorFromDso<T>(
    dso: IAlphaHttpObjectResultDso,
    factor?: (dsoData: any) => T): AlphaHttpObjectResult<T>{

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

/**
 * Represents an HTTP result containing a list of data objects.
 * Extends AlphaHttpResult and adds a typed data array property.
 * Provides a factory method for creation from DSO objects.
 */
export class AlphaHttpListResult<T> extends AlphaHttpResult {
  data: T[];

  /**
   * Constructs an AlphaHttpListResult instance.
   * @param status - Severity status of the result.
   * @param mutation - Mutation code of the result.
   * @param notifications - List of notifications.
   * @param hasMoreResults - Indicates if more results are available for pagination.
   * @param data - The array of data objects.
   */
  constructor(
    status: AlphaSeverityEnum,
    mutation: AlphaMutationEnum,
    notifications: AlphaHttpResultNotification[],
    hasMoreResults: boolean,
    data: T[]) {
    super(status, mutation, notifications, hasMoreResults);
    this.data = data;
  }

  /**
   * Factory method to create an AlphaHttpListResult from a DSO object.
   * @param dso - The data source object to convert.
   * @param factor - Optional function to transform each item in the data array.
   * @returns AlphaHttpListResult instance.
   */
  static override factorFromDso<T>(
    dso: IAlphaHttpListResultDso,
    factor?: (dsoData: any) => T): AlphaHttpListResult<T> {

    const dsoList = dso.data;
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
