import { PlaywrightTestArgs, PlaywrightWorkerArgs } from "@playwright/test";
import { PageFixtures } from "./page.fixtures.types";
import { GeneralComponents } from "./generalComponents.fixtures.types";
import { UserPageFixtures } from "./userPage.fixtures.types";

type BaseFixtures = PageFixtures & GeneralComponents;
type AllFixtures = PlaywrightTestArgs & PlaywrightWorkerArgs & BaseFixtures & UserPageFixtures;

export type { AllFixtures, BaseFixtures };
