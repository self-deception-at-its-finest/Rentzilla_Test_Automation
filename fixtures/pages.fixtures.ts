import { test as base } from "./auth.fixtures";
import { expect } from "@playwright/test";
import { HomePage } from "../pages/Home.page";
import { CreateUnitPage } from "../pages/CreateUnit.page";
import endpoints from "../constants/endpoints.constants.json";
import { buildTestAds } from "../utils/builders/ad.builder";
import { fillTab1Flow } from "../flows/ads/fillTab1.flow";
import { fillTab2Flow } from "../flows/ads/fillTab2.flow";
import { generateText } from "../utils/fakeData";
import { switchToAdminFlow } from "../flows/switchLogins.flow";
import { env } from "../config/env";
import { AdminPage } from "../pages/Admin.page";

const test = base.extend<{
    ads: void;
    authorizedHomePage: HomePage;
    createUnitPage: CreateUnitPage;
    createUnitPageWithFilledTab1: CreateUnitPage;
    createUnitPageWithFilledTwoTabs: CreateUnitPage;
    createUnitPageWithFilledTwoTabsAndNewService: {
        createUnitPage: CreateUnitPage;
        service: string;
    };
    homePage: HomePage;
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
            await fillTab1Flow(page, buildTestAds(1)[0]);
            await createUnitPage.nextStep();
            await use(createUnitPage);
        },
        { box: true },
    ],

    createUnitPageWithFilledTwoTabs: [
        async ({ createUnitPage, page }, use) => {
            const ad = buildTestAds(1)[0];
            await fillTab1Flow(page, ad);
            await createUnitPage.nextStep();
            await fillTab2Flow(page, ad.photo);
            await createUnitPage.nextStep();
            await use(createUnitPage);
        },
        { box: true },
    ],

    createUnitPageWithFilledTwoTabsAndNewService: [
        async ({ createUnitPage, page }, use) => {
            const ad = buildTestAds(1)[0];
            const service = ad.service + generateText(10);
            console.log("new service: " + service);

            await fillTab1Flow(page, ad);
            await createUnitPage.nextStep();
            await fillTab2Flow(page, ad.photo);
            await createUnitPage.nextStep();
            
            await use({ createUnitPage, service });
            
            await switchToAdminFlow(page, env.admin);
            await new AdminPage(page).removeService(service);
        }, { box: true }
    ],

    homePage: [
        async ({ page }, use) => {
            await use(new HomePage(page));
        },
        { box: false },
    ],
});

export { test, expect };
