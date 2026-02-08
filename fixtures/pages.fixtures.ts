import { test as base } from "./auth.fixtures";
import { expect } from "@playwright/test";
import { HomePage } from "../pages/Home.page";
import { CreateUnitPage } from "../pages/CreateUnit.page";
import endpoints from "../constants/endpoints.constants.json";
import { buildTestAds } from "../utils/builders/ad.builder";
import { createAdsFlow } from "../flows/ads/createAds.flow";
import { switchToAdminFlow } from "../flows/admin/switchToAdmin.flow";
import { env } from "../config/env";
import { approveAdsFlow } from "../flows/admin/approveAds.flow";
import { deleteAdsFlow } from "../flows/admin/deleteAds.flow";
import { fillTheTab1Flow } from "../flows/ads/fillTab1.flow";

const test = base.extend<{
    ads: void;
    authorizedHomePage: HomePage;
    createUnitPage: CreateUnitPage;
    createUnitPageWithAds: CreateUnitPage;
    createUnitPageWithFilledTab1: CreateUnitPage;
}>({
    ads: [
        async ({ auth, page }, use) => {
            await page.goto(endpoints["create unit"]);

            const testAds = buildTestAds(5);
            await createAdsFlow(page, testAds);

            await switchToAdminFlow(page, env.admin);
            await approveAdsFlow(page, testAds);

            await use(undefined);

            await deleteAdsFlow(page, testAds);
        },
        { box: false, title: "Ads managing" },
    ],

    createUnitPageWithAds: async ({ ads, page }, use) => {
        await use(new CreateUnitPage(page));
    },

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
