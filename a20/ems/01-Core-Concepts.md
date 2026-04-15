# 01 - Core Concepts

## Vocabulary first

### Head
Minimal projection for list/select contexts.

Example: `CustomerHead`

- `id`
- `displayName`
- `status`

### Body
Detailed projection for detail view.

`Body` usually extends `Head` and adds detail fields.

Example: `CustomerBody`

- all `CustomerHead` fields
- `address`
- `vatNumber`
- `orders: OrderHead[]`

### Ei (EditInfo)
Reference data required to render forms.

Example: `CustomerEi`

- `countries`
- `customerTypes`
- `vatProfiles`

### Ec (EditContainer)
Combined payload for edit screens.

```ts
interface CustomerEc {
  body: CustomerBody;
  ei: CustomerEi;
}
```

## Directional transport naming

### DSO (DownStreamingObject)
Response payload traveling from backend to frontend.

- `CustomerHeadDso`
- `CustomerBodyDso`
- `CustomerEiDso`

### USO (UpStreamingObject)
Request payload traveling from frontend to backend.

- `CustomerCreateUso`
- `CustomerUpdateUso`
- `OrderCreateUso`

## Why this split matters

- list views stay light and fast (`Head`)
- detail views stay complete (`Body`)
- forms get stable metadata (`Ei`)
- edit screens can load in one call (`Ec`)
- mapping code stays explicit and testable (`DSO -> model`, `model -> USO`)

## Typical endpoint matrix

- `GET /customers` -> `CustomerHeadDso[]`
- `GET /customers/{id}` -> `CustomerBodyDso`
- `GET /customers/ei` -> `CustomerEiDso`
- `GET /customers/{id}/ec` -> `CustomerEcDso`
- `POST /customers` with `CustomerCreateUso`
- `PUT /customers/{id}` with `CustomerUpdateUso`

## Frequent confusion points

- `Ei` is form metadata, not entity data.
- `Ec` is not a new entity; it is a read model for edit screens.
- `Body` can contain nested `Head` collections (for summary navigation).
- DSO/USO naming is about direction, not business meaning.

