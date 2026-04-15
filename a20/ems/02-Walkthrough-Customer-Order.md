# 02 - Walkthrough: Customer and Order

## Scenario
You need to support:

1. list customers
2. view one customer with related orders
3. create customer
4. edit customer
5. create/view orders

This module shows the EMS flow end to end.

## Step 1: List customers (Head)
UI asks for lightweight rows only.

Request:

```http
GET /customers
```

Response:

```json
[
  { "id": "c1", "displayName": "Contoso", "status": "Active" },
  { "id": "c2", "displayName": "Northwind", "status": "Prospect" }
]
```

Contract: `CustomerHeadDso[]`

## Step 2: Open customer detail (Body)
User opens one customer. UI now needs full details and order summaries.

Request:

```http
GET /customers/c1
```

Response:

```json
{
  "id": "c1",
  "displayName": "Contoso",
  "status": "Active",
  "address": "Main Street 1",
  "vatNumber": "BE0123456789",
  "orders": [
    { "id": "o10", "number": "SO-10", "total": 420.0 },
    { "id": "o11", "number": "SO-11", "total": 99.0 }
  ]
}
```

Contract: `CustomerBodyDso` with `orders: OrderHeadDso[]`

## Step 3: Open one order from the customer detail
Click on `OrderHead` to load the order detail.

Request:

```http
GET /orders/o10
```

Response contract: `OrderBodyDso`

## Step 4: Create customer (Ei + CreateUso)
Create screen needs reference data before submit.

Request edit info:

```http
GET /customers/ei
```

Response contract: `CustomerEiDso`

Submit create:

```http
POST /customers
```

Request contract: `CustomerCreateUso`

## Step 5: Edit customer (Ec + UpdateUso)
Edit screen needs current body and metadata together.

Request:

```http
GET /customers/c1/ec
```

Response contract: `CustomerEcDso`

```ts
interface CustomerEcDso {
  body: CustomerBodyDso;
  ei: CustomerEiDso;
}
```

Submit update:

```http
PUT /customers/c1
```

Request contract: `CustomerUpdateUso`

## Data flow summary

- Backend -> Frontend: `DSO` (`Head`, `Body`, `Ei`, `Ec`)
- Frontend -> Backend: `USO` (create/update intent)
- UI model factories parse DSO slices into concrete local models
- service layer sends USO payloads for mutations

## Common review checklist for this scenario

- List endpoint returns `Head`, not `Body`.
- Detail endpoint returns `Body` and nested `OrderHead[]` only.
- Create flow loads `Ei` before form submission.
- Edit flow loads `Ec` for single-call page initialization.
- All response/request types follow `Dso`/`Uso` naming direction.

