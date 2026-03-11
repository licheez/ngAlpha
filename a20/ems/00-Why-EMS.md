# 00 - Why EMS

## Who this is for
This course is for developers who can build CRUD features but feel that the EMS pattern looks too abstract at first glance.

## What problem EMS solves
Without a shared pattern, CRUD code usually drifts:

- every entity has slightly different endpoints
- list and detail payloads are mixed together
- edit screens duplicate data-loading logic
- frontend mapping logic is repeated and fragile

EMS standardizes these concerns so teams can focus on business behavior.

## EMS in one sentence
EMS is a full-stack pattern that separates **what data is needed** (Head/Body/Ei/Ec) from **how it flows** (DSO down, USO up), and wraps both in reusable base abstractions.

## Before vs after (mental model)

### Before EMS
- Entity-specific ad hoc API contracts
- Entity-specific UI orchestration
- Inconsistent naming and payload shapes

### After EMS
- Shared CRUD contract structure
- Shared orchestration via base components/services
- Predictable names and data slices across entities

## Why juniors feel complexity first
The first contact often includes many symbols at once:

- generic base classes
- interfaces for multiple slices
- mappers/factories/slicers

This feels heavy until the pattern is seen in one concrete flow.

## Core adoption idea
Learn in this order:

1. business flow (`Customer` and `Order`)
2. slice vocabulary (`Head`, `Body`, `Ei`, `Ec`)
3. transport direction (`DSO`, `USO`)
4. only then generic abstractions

## Success criteria for this course
After module 02, you should be able to:

- explain why list and detail use different slices
- identify when to request `Ei` vs `Ec`
- describe DSO vs USO without ambiguity
- implement one entity using the same naming and flow

