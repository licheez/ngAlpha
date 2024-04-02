# AlphaApi

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 15.2.0.

## Description / Concept

The idea behind this component is to standardize Web API responses by using a common wrapper.

Of course this only works when you are also using (the same) wrapper at server side.

The wrapper carries down the following information from the server.

* a status (AlphaSeverityEnum) that specifies how good the server processed the request.
* the mutation (AlphaMutationEnum) that specifies what (CRUD) action was taken by the server
* a list of notifications where you'll find any warning or error
* a flag (hasMoreResult) that tells the client that a paged list contains more elements
* the server response that can take two forms
  * an object
  * a list of objects

## Implementation

The wrapper is implemented as a base class and two generic subclasses.

```typescript
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

```

