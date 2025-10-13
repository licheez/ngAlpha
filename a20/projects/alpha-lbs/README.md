# AlphaLbs &nbsp;![npm](https://img.shields.io/npm/v/@pvway/alpha-lbs?color=blue) ![Angular](https://img.shields.io/badge/angular-20%2B-red) ![MIT](https://img.shields.io/badge/license-MIT-green)

> **Lightweight local bus service for Angular apps. In-memory publish/subscribe for fast, flexible message passing.**

---

## ✨ Features

- 📨 Simple publish/subscribe API
- 🏷️ Channel-based messaging with wildcard support
- ⚡ Fast, in-memory delivery (no server required)
- 🛡️ 100% unit test coverage
- 🚀 Angular 20+ compatible

---

## 📦 Installation

```bash
npm install @pvway/alpha-lbs
```

---

## 🛠️ Usage

```typescript
import { AlphaLbsService } from '@pvway/alpha-lbs';

// Inject AlphaLbsService in your component or service
constructor(private lbs: AlphaLbsService) {}

// Subscribe to a channel
const subId = this.lbs.subscribe((payload) => {
  console.log('Received:', payload);
}, 'my-channel');

// Publish a message
this.lbs.publish({ text: 'Hello!' }, 'my-channel');

// Unsubscribe
this.lbs.unsubscribe(subId);
```

---

## 📚 API Reference

### AlphaLbsService

- `subscribe<T>(callback: (payload: T) => void, channel?: string): number`
  - Subscribe to a channel. Supports exact match, prefix match (e.g. 'topic*'), or all channels (null).
  - Returns a subscriber ID for later unsubscription.

- `unsubscribe(subscriberId: number): void`
  - Remove a subscriber by ID.

- `publish<T>(payload: T, channel: string): number`
  - Broadcast a payload to all matching subscribers.
  - Returns the number of subscribers notified.

---

## 🧪 Testing

Run unit tests with coverage:

```bash
ng test alpha-lbs --code-coverage
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
import { AlphaLbsService } from '@pvway/alpha-lbs';

// Subscribe
const subId = lbs.subscribe((msg) => console.log(msg), 'news');

// Publish
lbs.publish('Breaking News!', 'news');

// Unsubscribe
lbs.unsubscribe(subId);
```

---

> Made with ❤️ for scalable Angular apps.
