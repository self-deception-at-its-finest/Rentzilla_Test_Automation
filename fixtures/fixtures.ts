import { test as base } from "@playwright/test";
import { HomePage } from "../pages/Home.page";
import { CreateUnitPage } from "../pages/CreateUnit.page";
import { AuthenticationComponent } from "../components/Authentication.component";
import { createAdsFlow } from "../flows/ads/createAds.flow";
import endpoints from "../constants/endpoints.constants.json";
import { env } from "../config/env";
import { buildTestAds } from "../utils/builders/ad.builder";
import { switchToAdminFlow } from "../flows/switchLogins.flow";
import { approveAdsFlow } from "../flows/admin/approveAds.flow";
import { deleteAdsFlow } from "../flows/admin/deleteAds.flow";
import { FavoriteUnitsPage } from "../pages/FavoriteUnits.page";
import { ProductsPage } from "../pages/Products.page";

type Fixtures = {
    auth: void;
    homePage: HomePage;
    authorizedHomePage: HomePage;
    authComponent: AuthenticationComponent;
    headerComponent: HeaderComponent;
    createUnitPage: CreateUnitPage;
    ads: CreateUnitPage;
    createUnitPageWithAds: CreateUnitPage;
    productsPage: ProductsPage;
    favoritePage: FavoriteUnitsPage;
};

export const test = base.extend<Fixtures>({
    homePage: async ({ page }, use) => {
        await use(new HomePage(page));
    },

    headerComponent: async ({ page }, use) => {
        await use(new HeaderComponent(page));
    },
  
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

    homePage: [
        async ({ page }, use) => {
            await use(new HomePage(page));
        },
        { box: true },
    ],

    productsPage: [
        async ({ page }, use) => {
            await use(new ProductsPage(page));
        },
        { box: true },
    ],
    
    favoritePage: [
        async ({ page }, use) => {
            await use(new FavoriteUnitsPage(page));
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
