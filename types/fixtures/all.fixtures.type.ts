import { PlaywrightTestArgs, PlaywrightWorkerArgs } from "@playwright/test";
import { PageFixtures } from "./page.fixtures.type";
import { UserPageFixtures } from "./userPage.fixtures.type";
import { CreateUnitComponents } from "./createUnitComponents.fixtures.type";

type BaseFixtures = UserPageFixtures & PageFixtures & CreateUnitComponents;
type AllFixtures = PlaywrightTestArgs & PlaywrightWorkerArgs & BaseFixtures;

export type { AllFixtures, BaseFixtures };
