# AlphaCommon &nbsp;![npm](https://img.shields.io/npm/v/%40pvway%2Falpha-common?color=blue) ![Angular](https://img.shields.io/badge/angular-20.3.18%2B-red) ![CI](https://img.shields.io/github/actions/workflow/status/your-org/alpha-common/ci.yml?branch=main) ![Coverage](https://img.shields.io/badge/coverage-100%25-brightgreen)

> **Reusable Angular utilities, API wrappers, and entity management helpers for scalable web apps.**

---

## ✨ Features

- 🧩 **Utility Classes**: String, number, date, and window helpers
- 🔗 **Standardized HTTP API Results**: Typed wrappers for server responses
- 🏷️ **Entity Management Service (EMS)**: Abstract CRUD APIs and UI base classes
- 🛡️ **100% Unit Test Coverage**: Reliable, maintainable code
- 🚀 **Angular 20.3.18+ Ready**: Standalone components, signals, and best practices

---

## 📦 Installation

```bash
npm install @pvway/alpha-common
```

## ✅ Compatibility

- Angular `20.3.18` or above
- Supported Angular peer range: `>=20.3.18 <21.0.0`

---

## 🛠️ Usage

Import the utilities, services, or base classes you need:

```typescript
import { AlphaUtils, AlphaWindow, AlphaYmd } from '@pvway/alpha-common';
import { AlphaEmsBaseApi, AlphaEmsBaseComponent } from '@pvway/alpha-common/ems';
```

---

## 📚 API Reference

### 🧮 AlphaUtils

Handy static methods for strings, numbers, base64, and blobs.

<details>
<summary>Show AlphaUtils methods</summary>

- `eon(str)`: Is string empty or null?
- `isNull(val)`: Is value null or undefined?
- `toNumberOrNull(val)`: Parse string to number or null
- `contains(strToCheck, stringToFind)`: Substring search (case-sensitive)
- `toLocaleCurrency(value, locale?, nbDigits?, currency?)`: Format as currency
- `round(value, precision?)`: Round to decimals
- `dataUrlToBlob(dataUrl, sliceSize?)`: DataURL → Blob
- `dataUrlToUint8Array(dataUrl, sliceSize?)`: DataURL → Uint8Array
- `b64ToUint8Array(b64Data, sliceSize?)`: Base64 → Uint8Array
- `b64ToBlob(b64Data, contentType?, sliceSize?)`: Base64 → Blob
- `getBlobUrl(b64Data, contentType?, sliceSize?)`: Base64 → Blob URL

</details>

---

### 🌐 AlphaWindow

Browser language and viewport utilities.

<details>
<summary>Show AlphaWindow methods</summary>

- `navigatorLanguageCode()`: Get browser language code
- `mediaWidth()`: Get viewport width category (`xs`, `sm`, `md`, `lg`, `xl`)

</details>

---

### 📅 AlphaYmd

Date parsing, formatting, and comparison helpers.

<details>
<summary>Show AlphaYmd methods</summary>

- `parse(ymd)`: Parse "YYYY-MM-DD" string to Date
- `stringify()`: Date → "YYYY-MM-DD" string
- `format(format?, sep?)`: Format date (YMD, DMY, MDY, DM)
- `formatRange(startDate, endDate, rangeSep?, format?, sep?)`: Format date range
- `toYmd(date)`: Normalize date to "YYYY-MM-DD"
- `inYmdRange(date, minDate, maxDate)`: Is date in range?
- `ymdEqual(dt0, dt1)`: Are dates equal?
- `ymdCompare(dt0, dt1)`: Compare dates

</details>

---

### 📦 HTTP Results

Standardized API response wrappers for consistent client/server communication.

- `AlphaHttpResult`: Base class for API responses
- `AlphaHttpObjectResult<T>`: Single object result
- `AlphaHttpListResult<T>`: List result

<details>
<summary>Show HTTP Result details</summary>

- Status, mutation, notifications, hasMoreResults, and data
- Factory methods for parsing server-side DTOs

</details>

---

### 🏢 Entity Management Service (EMS)

Abstract classes and interfaces for CRUD operations and UI forms.

- `AlphaEmsBaseApi`: Abstract API for entity CRUD
- `AlphaEmsBaseComponent`: Abstract UI base for entity forms
- `IAlphaEmsFormModel`: Interface for form models

<details>
<summary>Show EMS details</summary>

- **API Layer**: List, getBody, getBodyFe, getEi, baseCreate, baseUpdate, delete
- **UI Layer**: Form loading, saving, deleting, busy/verbose flags

</details>

---

## 🗂️ API Services

### AlphaUploadApiService

Handles chunked file uploads, progress notification, and error logging.

```typescript
import { AlphaUploadApiService } from 'alpha-common/api';

const service = new AlphaUploadApiService();
service.init(httpClient, uploadUrl, deleteUploadUrl, authorize, postErrorLog, chunkSize);
service.upload(data, notifyProgress).subscribe(uploadId => { /* ... */ });
service.deleteUpload(uploadId).subscribe(response => { /* ... */ });
```

### AlphaVersionApiService

Retrieves application version information from a remote endpoint, supports custom logic and error logging.

```typescript
import { AlphaVersionApiService } from 'alpha-common/api';

const service = new AlphaVersionApiService();
service.init(httpClient, getVersionUrl, postErrorLog);
service.getVersion().subscribe(version => { /* ... */ });
```

---

## 🏢 Entity Management (EMS)

### AlphaEmsService

Core service for entity management. Handles HttpClient, authorization, error logging, and event publishing.

```typescript
import { AlphaEmsService } from 'alpha-common/ems';

const ems = new AlphaEmsService();
ems.init(httpClient, authorize, postErrorLog, publish);
```

### AlphaEmsBaseApi

Abstract base class for CRUD operations on business entities. Supports listing, reading, creating, updating, and deleting entities.

```typescript
import { AlphaEmsBaseApi } from 'alpha-common/ems';

class MyEntityApi extends AlphaEmsBaseApi<Head, Body, EditInfo> {
  // Implement required factor methods
}
```

### AlphaEmsBaseComponent

Abstract base class for UI forms. Handles loading, saving, and deleting forms for entities.

```typescript
import { AlphaEmsBaseComponent } from 'alpha-common/ems';

class MyFormComponent extends AlphaEmsBaseComponent<Head, Body, EditInfo> {
  // Implement required form model factory
}
```

### Supporting Classes & Interfaces

- `AlphaEmsEditContainer<TB, TE>`: Container for edit info and entity body
- `AlphaEmsFormInput<TB>`: Factory methods for form input (read, new, edit)
- `AlphaEmsFormResult<TB>`: Result of form actions (create, read, update, delete)
- `AlphaEmsUsoOptionSet`: Helper for passing keys and options to API

---

## 🧩 Example: EMS CRUD Flow

```typescript
// Setup EMS service
const ems = new AlphaEmsService();
ems.init(httpClient);

// Create API instance
const api = new MyEntityApi(ems, 'EntityContext', '/api/entity', factorHead, factorBody, factorEi);

// List entities
api.list(true, 0, 10).subscribe(entities => { /* ... */ });

// Get entity body
api.getBody(true, ['id']).subscribe(body => { /* ... */ });

// Create new entity
api.baseCreate(body).subscribe(result => { /* ... */ });
```

---

## 🧪 Testing

Run unit tests with coverage:

```bash
ng test alpha-common --code-coverage
```

All APIs and utilities are covered by comprehensive Jasmine/Karma specs.

---

## 📝 Contributing

Pull requests and issues are welcome! Please follow Angular and TypeScript best practices.

---

## 📄 License

MIT

---

## 🔗 Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Signals & Standalone Components](https://angular.dev/guide/signals)
- [Karma Test Runner](https://karma-runner.github.io)
- [Jasmine Testing Framework](https://jasmine.github.io)

---

## 🏁 Quick Start

```typescript
import { AlphaUtils } from '@pvway/alpha-common';

const isEmpty = AlphaUtils.eon('');
const rounded = AlphaUtils.round(3.14159, 2);
```

---

## 🏆 Why AlphaCommon?

- 🚦 **Consistent API responses**
- 🧑‍💻 **Developer-friendly utilities**
- 🏗️ **Scalable entity management**
- 🧪 **Battle-tested with 100% coverage**
- 🛠️ **Ready for Angular 20.3.18+**

---

> Made with ❤️ for scalable Angular apps.
