import { test as base } from "./auth.fixtures";
import { expect } from "@playwright/test";
import { HomePage } from "../pages/Home.page";
import { CreateUnitPage } from "../pages/CreateUnit.page";
import endpoints from "../constants/endpoints.constants.json";
import { buildTestAds } from "../utils/builders/ad.builder";
import { fillTheTab1Flow } from "../flows/ads/fillTab1.flow";

const test = base.extend<{
    ads: void;
    authorizedHomePage: HomePage;
    createUnitPage: CreateUnitPage;
    createUnitPageWithFilledTab1: CreateUnitPage;
}>({
    authorizedHomePage: [
        async ({ auth, page }, use) => {
            await page.goto(endpoints.home);
            await use(new HomePage(page));
        },
        { box: true },
    ],

    createUnitPage: [
        async ({ auth, page }, use) => {
            await page.goto(endpoints["create unit"]);
            await use(new CreateUnitPage(page));
        },
        { box: false },
    ],

    createUnitPageWithFilledTab1: [
        async ({ createUnitPage, page }, use) => {
            await fillTheTab1Flow(page, buildTestAds(1)[0]);
            await createUnitPage.nextStep();
            await use(createUnitPage);
        },
        { box: false },
    ],
});

export { test, expect };
