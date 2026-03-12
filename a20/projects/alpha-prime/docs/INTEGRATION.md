# AlphaPrime Integration

This guide explains how to integrate `@pvway/alpha-prime` in an Angular application.

## 1) Install dependencies

```bash
npm install @pvway/alpha-prime primeng primeflex @fortawesome/fontawesome-free uuid
npm install @angular/core @angular/common
```

## 2) Add global styles

In your app build config (`angular.json`), include global styles required by your UI stack.

Example:

```json
"styles": [
  "node_modules/primeflex/primeflex.min.css",
  "node_modules/@fortawesome/fontawesome-free/css/all.css",
  "src/styles.scss"
]
```

## 3) Use standalone components

AlphaPrime components are authored as standalone Angular components and can be imported directly into standalone feature components.

## 4) Templates

Use selectors directly in templates, for example:

```html
<alpha-prime-filter-box></alpha-prime-filter-box>
<alpha-prime-select></alpha-prime-select>
<alpha-prime-save-button></alpha-prime-save-button>
```

## 5) API surface status

The package root exports are under active curation.

- Prefer documented/public entry points when available.
- Avoid relying on arbitrary deep imports in external apps unless you control both producer and consumer.

## Troubleshooting

- If styles look unthemed, verify PrimeNG/PrimeFlex and icon CSS are loaded globally.
- If dependency resolution fails, ensure Angular and PrimeNG versions are aligned with the compatibility matrix in `README.md`.

