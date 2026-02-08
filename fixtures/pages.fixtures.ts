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
import { ProductsPage } from "../pages/Products.page";
import { FavoriteUnitsPage } from "../pages/FavoriteUnits.page";

const test = base.extend<{
    ads: void;
    homePage: HomePage;
    authorizedHomePage: HomePage;
    createUnitPage: CreateUnitPage;
    createUnitPageWithAds: CreateUnitPage;
    productsPage: ProductsPage;
    favoritePage: FavoriteUnitsPage;
    favoriteUnitsState: string[];
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

    homePage: [
        async ({ page }, use) => {
            await use(new HomePage(page));
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

    favoriteUnitsState: [
        async ({ authorizedHomePage, productsPage, favoritePage }, use) => {
            // Setup: Add 3 units to favorites and store their names
            await authorizedHomePage.navAdsLink.click();
            const addedUnits = await productsPage.addUnitsToFavorites(3);

            await use(addedUnits);

            // Cleanup: Remove added units from favorites to reset state for other tests
            await authorizedHomePage.avatarBlock.click();
            await authorizedHomePage.dropdownAdsItem.click();
            await authorizedHomePage.sidebarFavoriteAdsVariant.click(); 
            await favoritePage.clearAllFavorites();
        },
        { box: false, title: "Manage Favorite Units State" }
    ],

});

export { test, expect };
