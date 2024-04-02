# AlphaCom (a.k.a. alpha-common)

This library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 17.2.0.

# Description

This library exposes some useful helpers (mainly made of static methods);

# AlphaUtils - a Utility Class for Various String and Number Operations

`AlphaUtils` is a TypeScript utility class that provides handy methods for common operations on strings, numbers, and certain data types. You can use it to perform operations like checking if a string is empty or null, checking if a value is null or undefined, converting a string to a number, detecting if a string contains a given substring, and more.

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

# AlphaWindow - Utility Class for Window Object Information

The class `AlphaWindow` provides utility functions to retrieve information from the Window object such as the user's browser language and the media width based on the viewport width.

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

# AlphaYmd - Date Formatting and Manipulation Class

The `AlphaYmd` class provides utilities for common date operations, such as parsing, formatting and comparison. It primarily handles date strings in the "YYYY-MM-DD" format and allows conversion between `Date` objects and their string representation.

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


