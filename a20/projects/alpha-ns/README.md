# AlphaNs

AlphaNs is an Angular library that provides robust navigation, browser interaction, and data utilities for scalable web applications. It is designed for maintainability, testability, and integration with modern Angular projects.

## ✨ Features

- 🚦 Navigation and tab management using Angular Router
- 🛡️ Safe resource URL generation
- 📦 Data URL and Blob utilities for downloads and previews
- 🔄 Query parameter manipulation without page reload
- 🧪 Testable browser API usage via dependency injection
- 🧰 Utility classes for working with base64, Blob, and binary data

## 📦 Installation

Install via npm:

```bash
npm install alpha-ns
```

> **Note:** This package requires Angular 16+.

## 🚀 Usage

### 📥 Importing the Service

```typescript
import { AlphaNsService } from 'alpha-ns';
```

### ⚙️ Initializing the Service

Inject and initialize the service in your component or root provider:

```typescript
// Example in a standalone Angular component
import { AlphaNsService } from 'alpha-ns';
import { inject } from '@angular/core';

const alphaNs = inject(AlphaNsService);

alphaNs.init(router, homePage, logCallback, navCallback);
```

### 🧭 Navigating to a Page

```typescript
alphaNs.navigate(page, pageParams, queryParams);
```

### 🌐 Opening a URL in a New Tab

```typescript
alphaNs.openUrlInNewTab('https://example.com');
```

### 📥 Downloading a Data URL

```typescript
alphaNs.downloadDataUrl('data:text/plain;base64,SGVsbG8sIHdvcmxkIQ==', 'hello.txt');
```

### 🛠️ Using Utility Methods

```typescript
import { AlphaNsUtils } from 'alpha-ns';

const blob = AlphaNsUtils.dataUrlToBlob(dataUrl);
const arr = AlphaNsUtils.b64ToUint8Array(base64String);
```

## 📚 API Reference

### AlphaNsService

- `init(router, homePage, postNavigationLog?, notifyNavigation?, windowRef?, urlFactory?)`: Configure the service for navigation and browser interaction.
- `navigate(page, pageParams?, queryParams?)`: Navigate to a page.
- `openUrlInNewTab(url)`: Open a URL in a new browser tab.
- `replaceQueryParams(qParams, notify?)`: Replace query parameters in the URL without reload.
- `openDataUrlInNewTab(dataUrl, sliceSize?)`: Preview/download a data URL in a new tab.
- `downloadDataUrl(dataUrl, fileName)`: Download a file from a data URL.

### AlphaNsUtils

- `dataUrlToBlob(dataUrl, sliceSize?)`: Convert a data URL to a Blob.
- `dataUrlToUint8Array(dataUrl, sliceSize?)`: Convert a data URL to Uint8Array.
- `b64ToUint8Array(b64Data, sliceSize?)`: Convert base64 to Uint8Array.
- `b64ToBlob(b64Data, contentType?, sliceSize?)`: Convert base64 to Blob.
- `getBlobUrl(b64Data, contentType?, sliceSize?)`: Get a blob URL from base64 data.

### AlphaPage & IAlphaPage

- Use `AlphaPage` to represent navigable pages in your app.
- `IAlphaPage` defines the page structure for navigation and logging.

## 🏗️ Building the Library

```bash
ng build alpha-ns
```

## 🚢 Publishing

After building, publish to npm:

```bash
cd dist/alpha-ns
npm publish
```

## 🧪 Testing

Run unit tests with Karma:

```bash
ng test alpha-ns
```

## 🤝 Contributing

Contributions are welcome! Please submit issues and pull requests via GitHub.

## 📄 License

This project is licensed under the MIT License.

## 🔗 Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Documentation](https://angular.dev/)
- [npm Documentation](https://docs.npmjs.com/)
