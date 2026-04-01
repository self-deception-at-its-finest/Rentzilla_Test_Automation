import { PlaywrightTestArgs, PlaywrightWorkerArgs } from "@playwright/test";
import { PageFixtures } from "./page.fixtures.types";
import { UserPageFixtures } from "./userPage.fixtures.types";
import { CreateUnitComponents } from "./createUnitComponents.fixtures.types";
import { GeneralComponents } from "./generalComponents.fixtures.types";

type BaseFixtures = UserPageFixtures & PageFixtures & CreateUnitComponents & GeneralComponents;
type AllFixtures = PlaywrightTestArgs & PlaywrightWorkerArgs & BaseFixtures;

export type { AllFixtures, BaseFixtures };
