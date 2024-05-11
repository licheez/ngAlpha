# AlphaCom (a.k.a. alpha-common)

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 16.2.4.

# Description

This library exposes some useful helpers (mainly made of static methods);

# AlphaUtils - a Utility Class for Various String and Number Operations

`AlphaUtils` is a TypeScript utility class that provides handy methods for common operations on strings, numbers, and certain data types. You can use it to perform operations like checking if a string is empty or null, checking if a value is null or undefined, converting a string to a number, detecting if a string contains a given substring, and more.

<details>

<summary>AlphaUtils details</summary>

## Table of Contents

- [Method Detail](#method-detail)
  - [eon()](#eon)
  - [isNull()](#isnull)
  - [toNumberOrNull()](#tonumberornull)
  - [contains()](#contains)
  - [toLocaleCurrency()](#tolocalecurrency)
  - [round()](#round)
  - [dataUrlToBlob()](#dataurltoblob)
  - [dataUrlToUint8Array()](#dataurltouint8array)
  - [b64ToUint8Array()](#b64touint8array)
  - [b64ToBlob()](#b64toblob)
  - [getBlobUrl()](#getbloburl)

## Method Detail

### eon

Checks if a string is null or empty.

**Parameters:**

`str` (string | undefined): The string to evaluate.

**Returns:**

(boolean): True if the string is null or empty, false otherwise.

---

### isNull

Checks if a value is null or undefined.

**Parameters:**

`val` (any): The value to check.

**Returns:**

(boolean): True if the value is null or undefined, otherwise false.

---

### toNumberOrNull

Converts a string to a number. Returns null when the value is undefined or cannot be converted to a number.

**Parameters:**

`val` (string | undefined): The value to be converted to a number.

**Returns:**

(number | null): The converted number value or null if the value is undefined or cannot be converted to a number.

---

### contains

Returns true if the string to find is found in the string to evaluate.

**Parameters:**

`strToCheck` (string): The string to evaluate.

`stringToFind` (string): The string to find within the string to evaluate.

**Note:** this method is case-sensitive.

**Returns:**

(boolean): True if the `strToCheck` contains `stringToFind`. False otherwise.

---

### toLocaleCurrency

Converts a numerical value to a currency representation with the specified locale, number of digits, and currency.

**Parameters:**

- `value` (number): The numerical value to be converted.
- `locale` (string, Optional): The locale code to be used for formatting the currency.
- `nbDigits` (number, Optional): The number of digits to be shown after the decimal point. Default is 2.
- `currency` (string, Optional): The currency code to be used for formatting the currency. Default is "EUR".

**Returns:**

(string): The converted currency representation of the value.

---

### round

Rounds the given value to the specified precision.

**Parameters:**

- `value` (number): The value to be rounded.
- `precision` (number, Optional): The number of decimal places to round to. Default is 0.

**Returns:**

(number): The rounded value.

---

### dataUrlToBlob

Converts a data URL string to a Blob object.

**Parameters:**

- `dataUrl` (string): The data URL to convert.
- `sliceSize` (number, Optional): The slice size for splitting the base64 data. Defaults to 512.

**Returns:**

(Blob): The converted Blob object.

---

### dataUrlToUint8Array

Converts a data URL to Uint8Array.

**Parameters:**

- `dataUrl` (string): The data URL to convert.
- `sliceSize` (number, Optional): The slice size for dividing the base64 string into chunks.

**Returns:**

(Uint8Array): The converted Uint8Array.

---

### b64ToUint8Array

Converts a base64 string to a Uint8Array.

**Parameters:**

- `b64Data` (string): The base64 string to convert.
- `sliceSize` (number, Optional): The size of each slice when converting the base64 string. Default is 512.

**Returns:**

(Uint8Array): The converted Uint8Array.

---

### b64ToBlob

Converts a base64 string to a Blob object.

**Parameters:**

- `b64Data` (string): The base64 string to convert.
- `contentType` (string, Optional): The content type of the Blob.
- `sliceSize` (number, Optional): The size of each slice for dividing the base64 data into chunks.

**Returns:**

(Blob): The resulting Blob object.

---

### getBlobUrl

Get the URL of a blob from base64 data.

**Parameters:**

- `b64Data` (string): The base64 encoded data.
- `contentType` (string, Optional): The type of the data.
- `sliceSize` (number, Optional): The size of each slice.

**Returns:**

(string): The URL of the blob.
</details>

# AlphaWindow - Utility Class for Window Object Information

The class `AlphaWindow` provides utility functions to retrieve information from the Window object such as the user's browser language and the media width based on the viewport width.

<details >
<summary> AlphaWindow details </summary>  

## Table of Contents

- [Method Detail](#method-detail)
  - [navigatorLanguageCode](#navigatorlanguagecode)
  - [mediaWidth](#mediawidth)

## Method Detail

### navigatorLanguageCode

Retrieves the language code of the user's browser.

**Returns:**

(string): The language code of the user's browser. Returns 'en' if the language cannot be determined.

---

### mediaWidth

Returns the media width based on the current viewport width.

The returned value can be one of the following: 'xs' (for viewports less than 576 pixels wide),
'sm' (for viewports 576 pixels wide and up),
'md' (for viewports 768 pixels wide and up), 'lg' (for viewports 992 pixels wide and up), 'xl' (for viewports 1200 pixels wide and up).

**Returns:**

('xs' | 'sm' | 'md' | 'lg' | 'xl'): The media width.

</details>

# AlphaYmd - Date Formatting and Manipulation Class

The `AlphaYmd` class provides utilities for common date operations, such as parsing, formatting and comparison. It primarily handles date strings in the "YYYY-MM-DD" format and allows conversion between `Date` objects and their string representation.

<details>
<summary>AlphaYmd details</summary>

## Table of Contents

- [Method Detail](#method-detail)
  - [parse](#parse)
  - [stringify](#stringify)
  - [format](#format)
  - [formatRange](#formatRange)
  - [toYmd](#toYmd)
  - [inYmdRange](#inYmdRange)
  - [ymdEqual](#ymdEqual)
  - [ymdCompare](#ymdCompare)

## Method Detail

### parse

Parses a string representing a date in the format "yyyy-MM-dd" and returns a `Date` object.

**Parameters:**

`ymd` (string): The string representing the date in "yyyy-MM-dd" format.

**Returns:**

(Date): The parsed Date object.

---

### stringify

Converts the date stored in the object to a string representation in the format 'YYYY-MM-DD'.

**Returns:**

(string): The string representation of the date.

---

### format

Formats the date using the specified format.

**Parameters:**

`format` (string, Optional): The format to use for formatting the date.
There are 4 supported formats : YMD, DMY, MDY and DM

`sep` (string, Optional): The separator to use. It can be 'Slash' or 'Dash'.

**Returns:**

(string): The formatted date string.

---

### formatRange

Formats the range of dates.

**Parameters:**

`startDate`  (Date): The start date of the range.

`endDate`    (Date): The end date of the range.

`ragneSep`  (string, Optional): The separator between the dates. Default is '-'.

`format` (string, Optional): The format to use for formatting the date. There are 4 supported formats : YMD, DMY, MDY and DM

`sep` (string, Optional): The separator to use. It can be 'Slash' or 'Dash'.

**Returns:**

(string): The formatted range of dates.

---

### toYmd

Converts the given date to a string in the format "YYYY-MM-DD" and then parses it back to a `Date` object. This can be useful for normalizing the time component of the date.

**Parameters:**

`date` (Date): The date to be converted.

**Returns:**

(Date): The converted date in the format "YYYY-MM-DD".

---

### inYmdRange

Checks if a given date is within a range of minimum and maximum dates.

**Parameters:**

`date`    (Date): The date to check.

`minDate` (Date): The minimum date of the range.

`maxDate` (Date): The maximum date of the range.

**Returns:**

(boolean): True if the date is within the range, false otherwise.

---

### ymdEqual

Checks if two dates have the same year, month, and day.

**Parameters:**

`dt0` (Date): The first date.

`dt1` (Date): The second date.

**Returns:**

(boolean): Returns true if the two dates have the same year, month, and day; otherwise, returns false.

---

### ymdCompare

Compares two dates and returns the comparison result.

**Parameters:**

`dt0` (Date): The first date to compare.

`dt1` (Date): The second date to compare.

**Returns:**

(number): Returns `0` if the dates are equal, `-1` if `dt0` < `dt1`, and `1` if `dt0` > `dt1`.

</details>

# Http results

## Description / Concept

The idea behind this component is to standardize Web API responses by using a common wrapper.

Of course this only works when you are also using (the same) wrapper at server side.

<details>
<summary>Http results details</summary>

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
</details>

# Entity Management Service (Ems)

## Introduction

The Entity Management Service is a set of classes that helps you to standardize the management of business entities.

It offers several layers.

### The Api layer

This layer is an abstract class that implements common logic for managing CRUD on business entities.

<details>

# AlphaEmsBaseApi class

The `AlphaEmsBaseApi` is an abstract base class aiming to provide foundational functionality for AlphaEms related operations involving HTTP requests.

## Concept

The model is built upon the following principle

Business entities can be divided (sliced) into two levels

The _**Head**_ represents the minimum information to be shown in lists.

The _**Body**_ extends the _Head_ information enabling to show the full details for a given entity

The _**EditInfo**_ (Ei) that contains all necessary info when it comes to _create_ or _update_ a given entity.

Let's provide a short example to make thinks clearer

The business entity **Customer** contains the following fields

* Id
* Name
* Address
* Country
* PreferredLanguage

Let's see how we can slice this information

### Head

The head for the customer entity will typically contain

* Id
* Name

### Body

The body for the customer will contain

* All head fields (inheritance)
* Address
* Country
* PreferredLanguage

### EditInfo (Ei)

When it comes to create or update a customer the user will need to get a list of countries and a list of languages to select from

* List of country (heads of country entity)
* List of language (heads of language entity)

Knowing this we can now look into the AlphaEmsBaseApi class

## Constructor

The `AlphaEmsBaseApi` takes the following parameters when initializing:

- `mEms`: An instance of the `AlphaEmsService`.
- `mHttp`: An instance of the `HttpClient`.
- `mContext`: A context string used for handling errors
- `mBaseUrl`: The base URL for the service controller
- `factorHead`, `factorBody`, `factorEi`: Functions that transforms a response object into the respective slides (Head, Body, Ei) for a given entity

### Methods

#### list(authorize: boolean, skip: number, take: number, options?: Map<string, string>, methodName?: string)

The `list` method sends a GET request to the API to fetch a list of entity heads.

The number of items to skip and take can be defined.

It also allows authorizing the request.

the options parameter is a map that enables the client to send a list of parameters to the server.

#### getBody(authorize: boolean, keys: string[], options?: Map<string, string>, methodName?: string)

The `getBody` method retrieves the body of the entity for a particular set of keys.

It has an option to authorize the request.

#### getBodyFe(keys: string[], options?: Map<string, string>, methodName?: string)

Read getBody for Edit

The `getBodyFe` method is similar to `getBody` but returns an observable of `IAlphaEmsEditContainer<TB, TE>`.

The method returns a container that contains
* The body
* The Edit info

## getEi(options?: Map<string, string>, methodName?: string)

The `getEi` method is used for getting the Edit info needed for creating an entity.

## baseCreate(body: any, methodName?: string)

The `baseCreate` method sends a POST request to the API to create a new entity.

It will emit a 'create' event on successful creation.

## baseUpdate(body: any, methodName?: string)

The `baseUpdate` method sends a POST request to the server to update an existing entity.

It will emit an 'update' event on successful update.

## delete(keys: string[], options?: Map<string, string>, methodName?: string)

The `delete` method is used for deleting an existing entity.

It will emit a 'delete' or 'update' event on success depending on the response.

</details>

### The UI layer

This takes the form of
* a base class that your component should derive from and
* an interface that the form model should implement

<details>
<summary>the base class for the component</summary>

# AlphaEmsBaseComponent

The AlphaEmsBaseComponent is an abstract class that provides base functionality for performing CRUD operations on a form. It is a generic class that takes three parameters `TH`, `TB`, and `TE`.

## Properties

- `busy` (boolean): Flag that indicates whether the form is currently busy.
- `verbose` (boolean): Flag that indicates whether to log the outputs in console.
- `api` (AlphaEmsBaseApi<TH, TB, TE>): The API service providing necessary methods.
- `allowAnonymousRead` (boolean): Flag that indicates whether read is allowed for anonymous. Default is true.

## Methods

The methods include various operations like loading the form, saving the form, and deleting the form data. The detailed description of the methods along with their parameters and return types are as follows:

- `loadForm(fi: AlphaEmsFormInput<TB>): Observable<IAlphaEmsFormModel<TH, TB, TE>>`

  Loads the form based on the mode (read, edit, or new) set in AlphaEmsFormInput fi. Returns an observable of the form that should be cast to the concrete form.

- `save(fm: IAlphaEmsFormModel<TH, TB, TE>): Observable<AlphaEmsFormResult<TB>>`

  Saves the form and returns an observable with the form result. This method also manages the busy state.

- `delete(options?: Map<string, string>): Observable<AlphaEmsFormResult<TB>>`

  Deletes the form data and returns an observable of the form result. This method also manages the busy state.

## Usage

To use this class, create a new class and extend the AlphaEmsBaseComponent class. Override the necessary methods.

</details>

<details>
<summary>the interface the form model should implement</summary>

```typescript

import {Observable} from "rxjs";
import {AlphaEmsFormInput} from "./alpha-ems-form-input";
import {AlphaEmsBaseApi} from "./alpha-ems-base-api";

export interface IAlphaEmsFormModel<TH, TB, TE> {
  api: AlphaEmsBaseApi<TH, TB, TE>;
  fi: AlphaEmsFormInput<TB>;
  body: TB | undefined;
  ei: TE | undefined;
  invalid: boolean;
  populateForRead(body: TB): void;
  populateForNew(ei: TE): void;
  populateForEdit(ei: TE, body: TB): void;
  createEntity(): Observable<TB>;
  updateEntity(): Observable<TB>;
}


```

</details>
