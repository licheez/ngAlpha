# AlphaPrime Components

This document lists the current component/directive/pipe/service inventory in `@pvway/alpha-prime`.

## Components

| Selector | Purpose |
| --- | --- |
| `alpha-prime-add-button` | Reusable Add action button. |
| `alpha-prime-auto-complete` | Text search with suggestion list and optional add action. |
| `alpha-prime-cancel-button` | Reusable Cancel action button. |
| `alpha-prime-confirmation-modal` | Confirmation modal wrapper. |
| `alpha-prime-currency-input` | Currency-focused numeric input. |
| `alpha-prime-date-picker` | Single date picker input. |
| `alpha-prime-date-range-picker` | Start/end date range input. |
| `alpha-prime-debug-tag` | Debug label helper for component tracing. |
| `alpha-prime-delete-button` | Reusable Delete action button. |
| `alpha-prime-edit-button` | Reusable Edit action button. |
| `alpha-prime-file-upload` | File upload input/control. |
| `alpha-prime-filter-box` | Search/filter input with clear/add actions. |
| `alpha-prime-label` | Label helper component. |
| `alpha-prime-login-form` | Login form composition component. |
| `alpha-prime-login-modal` | Login modal container. |
| `alpha-prime-number-input` | Numeric input with validation behavior. |
| `alpha-prime-ok-button` | Reusable OK action button. |
| `alpha-prime-password-input` | Password input control. |
| `alpha-prime-progress-bar` | Progress indicator component. |
| `alpha-prime-save-button` | Reusable Save action button. |
| `alpha-prime-scroller` | Scrollable container utility. |
| `alpha-prime-select` | Select/dropdown input with action button support. |
| `alpha-prime-submit-button` | Reusable Submit action button. |
| `alpha-prime-switch` | Toggle switch input. |

## Directives

| Selector | Purpose |
| --- | --- |
| `[alphaPrimeRemainingHeight]` | Sizes an element to remaining viewport/container height. |

## Pipes

| Name | Purpose |
| --- | --- |
| `alphaPrimeBoldify` | Highlights matching fragments (used by autocomplete suggestions). |

## Services

| Service | Purpose |
| --- | --- |
| `AlphaPrimeService` | Utility and shared helper methods (IDs, translations, etc.). |
| `AlphaPrimeModalService` | Modal open/close abstractions and orchestration helpers. |

## Notes

- The root package export surface is being finalized.
- Treat deep import paths as implementation details unless explicitly documented as public API.

