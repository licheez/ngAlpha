# AlphaPrime Development

Maintainer notes for local development, validation, and publishing.

## Workspace commands

Run from repository root (`a20/`):

```bash
npm install
npx ng test AlphaPrime
npx ng build AlphaPrime
```

## Publish flow

```bash
npx ng build AlphaPrime
cd dist/alpha-prime
npm publish
```

## Recommended pre-publish checklist

- Confirm `projects/alpha-prime/package.json` version is bumped.
- Confirm `projects/alpha-prime/README.md` and docs links are up to date.
- Run tests for impacted components.
- Build the package and inspect `dist/alpha-prime` output.
- Verify repository/bugs/homepage URLs are correct.

## Documentation structure

- `README.md`: npm-facing quick start and package overview.
- `docs/COMPONENTS.md`: inventory of selectors, directive, pipe, and services.
- `docs/INTEGRATION.md`: app integration notes.
- `docs/DEVELOPMENT.md`: maintainer workflow (this file).

## Known packaging note

The current entrypoint in `src/public-api.ts` should export the symbols intended for npm consumers.
Without a curated public API surface, consumers may not get stable import paths.

