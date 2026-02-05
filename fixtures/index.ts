import { mergeTests } from "@playwright/test";

import { test as pages } from "./pages.fixtures";
import { test as createUnitComponents } from "./createUnitComponents.fixtures";

export const test = mergeTests(pages, createUnitComponents);

export { expect } from "@playwright/test";
