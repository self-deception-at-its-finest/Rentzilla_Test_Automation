import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { CreateUnitPage } from "../pages/create-unit.page";
import { AuthenticationComponent } from "../components/authentication.component";
import { createAdsFlow } from "../flows/ads/create-ads.flow";
import endpoints from "../constants/endpoints.constants.json";
import { env } from "../config/env";
import { buildTestAds } from "../utils/builders/ad.builder";
import { switchToAdminFlow } from "../flows/admin/switch-to-admin.flow";
import { approveAdsFlow } from "../flows/admin/approve-ads.flow";
import { deleteAdsFlow } from "../flows/admin/delete-ads.flow";

type Fixtures = {
    auth: void;
    authorizedHomePage: HomePage;
    authComponent: AuthenticationComponent;
    createUnitPage: CreateUnitPage;
    ads: CreateUnitPage;
    createUnitPageWithAds: CreateUnitPage;
};

export const test = base.extend<Fixtures>({
    authComponent: [
        async ({ page }, use) => {
            await use(new AuthenticationComponent(page));
        },
        { box: true },
    ],

    auth: [
        async ({ authComponent, page }, use) => {
            await page.goto(endpoints.home);
            await authComponent.login(env.user);
            await use(undefined);
        },
        { box: true },
    ],

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

    /**
     * 1. Creating of test ads
     * 2. Approving of ads via admin
     * 3. Testing
     * 4. Deleting of created ads
     */
    ads: [
        async ({ auth, page }, use) => {
            await page.goto(endpoints["create unit"]);

            // Creating of test ads
            const testAds = buildTestAds(5);
            await createAdsFlow(page, testAds);
            // Approving of ads flow
            await switchToAdminFlow(page, env.admin);
            await approveAdsFlow(page, testAds);
            // Testing
            await use(new CreateUnitPage(page));
            // Deleting of created ads
            await deleteAdsFlow(page, testAds);
        },
        { box: false, title: "Ads managing" },
    ],

    createUnitPageWithAds: async ({ auth, ads }, use) => {
        await use(ads);
    },
});

export { expect } from "@playwright/test";
