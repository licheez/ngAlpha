# AlphaTs <img src="https://img.shields.io/badge/Angular-20.3.0-red?logo=angular" alt="Angular" height="20"/> <img src="https://img.shields.io/npm/v/@pvway/alpha-ts.svg?logo=npm" alt="npm version" height="20"/> <img src="https://img.shields.io/badge/License-MIT-green.svg" alt="License: MIT" height="20"/>

> **Type-safe, extensible translation and enum utilities for Angular 20+**

---

## ✨ Features

- <img src="https://img.shields.io/badge/TypeScript-Strict-blue?logo=typescript" height="16"/> 100% TypeScript, strict types, no `any`
- <img src="https://img.shields.io/badge/Angular-Standalone-orange?logo=angular" height="16"/> Designed for Angular standalone components
- <img src="https://img.shields.io/badge/Signal%20Ready-Yes-brightgreen" height="16"/> Signal-based state management
- <img src="https://img.shields.io/badge/Cache%20Persistence-LocalStorage-yellow" height="16"/> Translation cache with localStorage/sessionStorage support
- <img src="https://img.shields.io/badge/Extensible%20API-Easy-blueviolet" height="16"/> Easily extend translation sources and error logging
- <img src="https://img.shields.io/badge/Enum%20Helpers-Yes-9cf" height="16"/> Type-safe enum item wrappers with captions

---

## 📦 Installation

```bash
npm install @pvway/alpha-ts
```

---

## 🚀 Quick Start

```typescript
import { AlphaTsService } from '@pvway/alpha-ts';

// Inject AlphaTsService in your component or service
constructor(private alphaTs: AlphaTsService) {}

// Initialize (optionally with custom API, error logger, or storage)
this.alphaTs.init();

// Get a translation
const caption = this.alphaTs.getTr('alpha.buttons.add');

// Change language
this.alphaTs.changeLanguageCode('fr');
```

---

## 🧩 Library Structure

- **Translation Cache**: Efficiently stores and retrieves translations for multiple languages.
- **API Service**: Fetches translation updates from your backend (customizable).
- **Enum Utilities**: Wrap enums with captions for UI display.
- **Abstractions**: Type-safe interfaces for translation items, rows, and cache.

---

## 🛠️ Usage Examples

### Translation
```typescript
const addLabel = alphaTs.getTr('alpha.buttons.add', 'en'); // "Add"
```

### Enum Item Factory
```typescript
import { AlphaTsEnumItemFactory } from '@pvway/alpha-ts';

const enumItem = AlphaTsEnumItemFactory.factor({ code: 'A', caption: 'Active' }, code => MyEnum[code]);
```

### Custom Error Logging
```typescript
alphaTs.init(undefined, undefined, (context, method, error) => {
  // Send error to your logging backend
  console.error(`[${context}] ${method}: ${error}`);
});
```

---

## 🌐 Example: Backend API Response for Translations

When using `AlphaTsApiService` to update translations from your backend, your API should return a JSON response similar to the following:

```json
{
  "data": {
    "isUpToDate": false,
    "translationsCache": {
      "lastUpdateDate": "2025-10-16T12:00:00.000Z",
      "translations": {
        "alpha.buttons.add": {
          "en": "Add",
          "fr": "Ajouter",
          "nl": "Toevoegen"
        },
        "alpha.buttons.cancel": {
          "en": "Cancel",
          "fr": "Annuler",
          "nl": "Annuleren"
        }
        // ... more keys ...
      }
    }
  }
}
```

- `isUpToDate`: Set to `true` if the client cache is current, otherwise `false`.
- `translationsCache.lastUpdateDate`: The UTC date of the last update.
- `translationsCache.translations`: An object mapping translation keys to language dictionaries.

**Backend Example (Node.js/Express):**

```js
app.get('/api/translation-cache', (req, res) => {
  const clientDate = new Date(req.query.clientDate);
  // Fetch the latest cache from your database or source
  const serverCache = getLatestTranslationCache();
  const isUpToDate = clientDate >= new Date(serverCache.lastUpdateDate);
  res.json({
    data: {
      isUpToDate,
      translationsCache: isUpToDate ? undefined : serverCache
    }
  });
});
```

---

## 🧪 Testing

Run unit tests with:
```bash
ng test AlphaTs
```

---

## 📚 API Reference

- `AlphaTsService`: Main translation service
- `AlphaTranslationCache`: Translation cache logic
- `AlphaTsApiService`: API integration for translation updates
- `AlphaTsEnumItemFactory`: Enum item wrapper
- `IAlphaTranslationItem`, `IAlphaTranslationRow`, `IAlphaTranslationCache`: Type-safe abstractions

---

## 📝 License

This library is [MIT licensed](./LICENSE).

---

## 🤝 Contributing

Contributions, issues and feature requests are welcome! Feel free to check [issues page](https://github.com/pvway/alpha-ts/issues).

---

## 👤 Author

- [PVWay](https://github.com/pvway)

---

## 🌍 Related Packages

- [@pvway/alpha-oas](https://www.npmjs.com/package/@pvway/alpha-oas) <img src="https://img.shields.io/npm/v/@pvway/alpha-oas.svg?logo=npm" height="16"/>
- [@pvway/alpha-common](https://www.npmjs.com/package/@pvway/alpha-common) <img src="https://img.shields.io/npm/v/@pvway/alpha-common.svg?logo=npm" height="16"/>

---

## 📦 Publishing

To build and publish:
```bash
ng build AlphaTs
cd dist/alpha-ts
npm publish
```

---

## 📖 More Info

- [Angular CLI Documentation](https://angular.dev/tools/cli)
- [Angular Standalone Components](https://angular.dev/guide/standalone-components)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
