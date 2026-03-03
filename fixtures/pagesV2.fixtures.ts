import { test as apiAuth } from "./apiAuth.fixtures";
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
import { ENDPOINTS } from "../constants/endpoints.constants";

const test = apiAuth.extend<{
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
        async ({ userPage }, use) => {
            await userPage.goto(endpoints.home);
            await use(new HomePage(userPage));
        },
        { box: true },
    ],

    createUnitPage: [
        async ({ userPage }, use) => {
            await userPage.goto(endpoints["create unit"]);
            await use(new CreateUnitPage(userPage));
        },
        { box: false },
    ],

    createUnitPageWithFilledTab1: [
        async ({ createUnitPage, userPage }, use) => {
            await fillTab1Flow(userPage, buildTestAds(1)[0]);
            await createUnitPage.nextStep();
            await use(createUnitPage);
        },
        { box: true },
    ],

    createUnitPageWithFilledTwoTabs: [
        async ({ createUnitPage, userPage }, use) => {
            const ad = buildTestAds(1)[0];
            await fillTab1Flow(userPage, ad);
            await createUnitPage.nextStep();
            await fillTab2Flow(userPage, ad.photo);
            await createUnitPage.nextStep();
            await use(createUnitPage);
        },
        { box: false },
    ],

    createUnitPageWithFilledTwoTabsAndNewService: [
        async ({ createUnitPage, userPage, adminPage }, use) => {
            const ad = buildTestAds(1)[0];
            const service = ad.service + generateText(10);
            console.log("new service: " + service);

            await fillTab1Flow(userPage, ad);
            await createUnitPage.nextStep();
            await fillTab2Flow(userPage, ad.photo);
            await createUnitPage.nextStep();

            await use({ createUnitPage, service });
            await adminPage.goto(ENDPOINTS.HOME);
            await switchToAdminFlow(adminPage, env.admin);
            await new AdminPage(adminPage).removeService(service);
        },
        { box: false },
    ],

    homePage: [
        async ({ userPage }, use) => {
            await use(new HomePage(userPage));
        },
        { box: false },
    ],
});

export { test, expect };
