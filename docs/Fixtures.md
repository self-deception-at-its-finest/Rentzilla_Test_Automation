# Fixture Architecture
This section describes the principles of using fixtures together and in tests, taking into account their execution logic.

**Key principles:**
- The directory of fixtures is `/fixtures`.
- If a fixture simply performs its own independent work and does not pass a class instance for further control, then `use()` must be called without arguments or with `undefined`.

- `base.extend` must include the types of the fixtures defined inside it to ensure type safety.

- Page fixtures and Component fixtures must be located in different files.

## __index.ts__
Contains the `mergeTests` function for merging fixtures from different files in a single place. Tests import `test` and `expect` specifically from here.
## base.fixtures.ts
Contains the default `test`, which is imported into independent fixtures. Currently it is a complete analogue of `@playwright/test`, but is used because it has the potential to be extended.
## pages.fixtures.ts
Fixtures for regular pages and pages with customizable preconditions.
## generalComponents.fixtures.ts
Shared component fixtures that do not depend on the current website page.
## createUnitComponents.fixtures.ts
Fixtures for components related to the `/create-unit` page.
## auth.fixtures.ts
User authentication fixtures. Has a dependency:
`auth` ← `authComponent` (from `generalComponents.fixtures.ts`).
