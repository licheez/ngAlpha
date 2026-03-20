<!-- AlphaOas - OAuth Authentication Library for Angular -->

<h1 align="center">AlphaOas <img src="https://img.shields.io/npm/v/%40pvway%2Falpha-oas.svg" alt="npm version" height="20"> <img src="https://img.shields.io/bundlephobia/min/%40pvway%2Falpha-oas.svg" alt="bundle size" height="20"> <img src="https://img.shields.io/github/license/your-org/alpha-oas.svg" alt="license" height="20"> <img src="https://img.shields.io/github/workflow/status/your-org/alpha-oas/CI" alt="build status" height="20"></h1>

<p align="center">
  <img src="https://img.shields.io/npm/dm/%40pvway%2Falpha-oas.svg" alt="npm downloads" height="20">
  <img src="https://img.shields.io/codecov/c/github/your-org/alpha-oas.svg" alt="coverage" height="20">
  <img src="https://img.shields.io/badge/angular-20.3.18%2B-dd0031.svg" alt="Angular" height="20">
</p>

---

> <strong>AlphaOas</strong> is a robust, scalable OAuth authentication and authorization library for Angular 20.3.18+ applications. It provides a complete solution for managing user sessions, tokens, and secure HTTP communication, following Angular and TypeScript best practices.

---

## ✨ Features

- 🔒 OAuth2 authentication and token management
- 🧑‍💻 Strongly-typed user and principal models
- 🛡️ HTTP interceptor for secure API requests
- 🗝️ Session and refresh token lifecycle management
- 🧩 Extensible with custom sign-in, refresh, and authorize logic
- 🏷️ Language and client identification headers
- 🦾 Designed for standalone Angular libraries
- 🧪 Full unit test coverage

## 🚀 Installation

```bash
npm install @pvway/alpha-oas uuid
```

> <img src="https://img.shields.io/npm/v/%40pvway%2Falpha-oas.svg" alt="npm version" height="16"> Requires Angular `20.3.18` or above, with Angular peer range `>=20.3.18 <21.0.0`, and RxJS 7+.

## 📦 Usage

### 1. Import and Provide the Service

```typescript
import { AlphaOasService } from '@pvway/alpha-oas';

// ProvidedIn: 'root' - no need to add to providers
```

### 2. Initialize the Service

```typescript
service.init(
  httpClient,
  getMeUrl,
  refreshUrl,
  signInUrl,
  postErrorLog?,
  onPrincipalUpdated?
);
```

### 3. Authenticate and Authorize

```typescript
service.signIn(username, password, rememberMe).subscribe(...);
service.refresh().subscribe(...);
service.getMe().subscribe(...);
service.authorize(httpRequest).subscribe(...);
```

### 4. Use the HTTP Interceptor

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AlphaOasInterceptor } from '@pvway/alpha-oas';

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AlphaOasInterceptor, multi: true }
  ]
})
```

## 🧑‍🎓 API Overview

- `AlphaOasService`: Main authentication service
- `AlphaOasInterceptor`: HTTP interceptor for secure requests
- `AlphaPrincipal`: Tracks authentication state and user
- `IAlphaUser`, `IAlphaAuthEnvelop`, `IAlphaPrincipal`: Strongly-typed models
- `AlphaSessionData`, `AlphaRefreshData`: Token lifecycle helpers

## 🧪 Testing

Run unit tests with:

```bash
ng test AlphaOas
```

## 🛠️ Building & Publishing

Build the library:

```bash
ng build AlphaOas
```

Publish to npm:

```bash
cd dist/alpha-oas
npm publish
```

## 📚 Documentation

- [Angular CLI Reference](https://angular.dev/tools/cli)
- [OAuth 2.0 Overview](https://oauth.net/2/)
- [RxJS Documentation](https://rxjs.dev/)

## 📝 License

This project is licensed under the MIT License.

---

<p align="center">
  <img src="https://img.shields.io/github/stars/your-org/alpha-oas.svg?style=social" alt="GitHub stars" height="20">
  <img src="https://img.shields.io/github/forks/your-org/alpha-oas.svg?style=social" alt="GitHub forks" height="20">
</p>
