import { mergeTests } from "@playwright/test";

import { test as pagesV2 } from "./pagesV2.fixtures";
import { test as createUnitComponentsV2 } from "./createUnitComponentsV2.fixtures";
import { test as generalComponents } from "./generalComponents.fixtures";

export const test = mergeTests(pagesV2, createUnitComponentsV2, generalComponents);

export { expect } from "@playwright/test";
