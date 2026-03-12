# @pvway/alpha-prime

Reusable Angular UI building blocks built on PrimeNG.

`@pvway/alpha-prime` is a component library for form controls, action buttons, modals, and utility widgets used in the ngAlpha ecosystem.

## Table of Contents

- [Why this library](#why-this-library)
- [Compatibility](#compatibility)
- [Installation](#installation)
- [Quick usage notes](#quick-usage-notes)
- [Component catalog](#component-catalog)
- [Extended docs](#extended-docs)
- [Development](#development)
- [Publishing](#publishing)
- [License](#license)

## Why this library

- Standalone Angular components for common product UI patterns.
- PrimeNG-based controls with an opinionated visual and UX baseline.
- Includes components, directives, pipes, and support services.

## Compatibility

- Angular: `^20.3.6`
- PrimeNG: `^20.2.0`
- PrimeFlex: `^4.0.0`
- Font Awesome: `^7.1.0`

See `package.json` for the authoritative dependency list.

## Installation

```bash
npm install @pvway/alpha-prime primeng primeflex @fortawesome/fontawesome-free uuid
```

Peer dependencies (install in your app):

```bash
npm install @angular/core @angular/common
```

## Quick usage notes

- Components are authored as Angular standalone components.
- Add required global styles in your Angular app (for example PrimeFlex and Font Awesome CSS).
- This package currently has an evolving root export surface; check the docs below for the current component inventory and integration guidance.

## Component catalog

Current library inventory includes:

- 23 UI components (buttons, inputs, pickers, select, scroller, modals, and helpers)
- 1 directive: `alphaPrimeRemainingHeight`
- 1 pipe: `alphaPrimeBoldify`
- 2 services: `AlphaPrimeService`, `AlphaPrimeModalService`

Full selector and feature list: [`docs/COMPONENTS.md`](https://github.com/licheez/ngAlpha/tree/main/a20/projects/alpha-prime/docs/COMPONENTS.md)

## Extended docs

If you want a split documentation set (npm README + detailed guides), start here:

- Component inventory: [`docs/COMPONENTS.md`](https://github.com/licheez/ngAlpha/tree/main/a20/projects/alpha-prime/docs/COMPONENTS.md)
- App integration notes: [`docs/INTEGRATION.md`](https://github.com/licheez/ngAlpha/tree/main/a20/projects/alpha-prime/docs/INTEGRATION.md)
- Maintainer workflows: [`docs/DEVELOPMENT.md`](https://github.com/licheez/ngAlpha/tree/main/a20/projects/alpha-prime/docs/DEVELOPMENT.md)

## Development

From the repository root:

```bash
npm install
npx ng test AlphaPrime
npx ng build AlphaPrime
```

## Publishing

```bash
npx ng build AlphaPrime
cd dist/alpha-prime
npm publish
```

## License

MIT
