# AlphaLs &nbsp;![npm](https://img.shields.io/npm/v/%40pvway%2Falpha-ls?color=blue) ![Angular](https://img.shields.io/badge/angular-20.3.18%2B-red) ![MIT](https://img.shields.io/badge/license-MIT-green)

> **Logging and navigation tracking service for Angular apps. Easily post error and navigation logs to remote endpoints, or inject custom logging delegates.**

---

## ✨ Features

- 📝 Post error logs and navigation logs via HTTP POST
- 🛠️ Inject custom delegates for logging
- ⚡ Lightweight, fast, and extensible
- 🛡️ 100% unit test coverage
- 🚀 Angular 20.3.18+ compatible

---

## 📦 Installation

```bash
npm install @pvway/alpha-ls
```

## ✅ Compatibility

- Angular `20.3.18` or above
- Supported Angular peer range: `>=20.3.18 <21.0.0`

---

## 🛠️ Usage

```typescript
import { AlphaLsService } from '@pvway/alpha-ls';

// Inject AlphaLsService in your component or service
constructor(private ls: AlphaLsService) {}

// Initialize with HttpClient and log URLs
ls.init(httpClient, 'https://your-error-log-url', 'https://your-navigation-log-url');

// Post an error log
ls.postErrorLog('context', 'method', 'error message');

// Post a navigation log
ls.postNavigationLog('/path', 'Page Title');

// Inject a custom error log delegate
ls.usePostErrorLog((context, method, error) => {
  // Custom logging logic
});

// Inject a custom navigation log delegate
ls.usePostNavigationLog((path, title) => {
  // Custom navigation logging logic
});
```

---

## 📚 API Reference

### AlphaLsService

- `init(httpClient: HttpClient, postErrorLogUrl?: string, postNavigationLogUrl?: string): void`
  - Initialize the service with HttpClient and optional log URLs.

- `postErrorLog(context: string, method: string, error: string): void`
  - Post an error log to the configured endpoint or delegate.

- `postNavigationLog(path: string, title: string): void`
  - Post a navigation log to the configured endpoint or delegate.

- `usePostErrorLog(delegate: (context: string, method: string, error: string) => any): void`
  - Inject a custom error log delegate.

- `usePostNavigationLog(delegate: (path: string, title: string) => any): void`
  - Inject a custom navigation log delegate.

---

## 🧪 Testing

Run unit tests with coverage:

```bash
ng test alpha-ls --code-coverage
```

---

## 📝 Contributing

Pull requests and issues are welcome! Please follow Angular and TypeScript best practices.

---

## 📄 License

MIT

---

## 🔗 Resources

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Karma Test Runner](https://karma-runner.github.io)
- [Jasmine Testing Framework](https://jasmine.github.io)

---

## 🏁 Quick Start

```typescript
import { AlphaLsService } from '@pvway/alpha-ls';

// Initialize
ls.init(httpClient, 'https://your-error-log-url', 'https://your-navigation-log-url');

// Post logs
ls.postErrorLog('context', 'method', 'error');
ls.postNavigationLog('/path', 'title');
```

---

> Made with ❤️ for scalable Angular apps.
