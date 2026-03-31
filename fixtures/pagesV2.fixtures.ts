import { test as apiAuth } from "./apiAuth.fixtures";
import { expect } from "@playwright/test";
import { HomePage } from "@pages/Home.page";
import { CreateUnitPage } from "@pages/CreateUnit.page";
import { UnitPage } from "@pages/Unit.page";
import { FavoriteUnitsPage } from "@pages/FavoriteUnits.page";
import { MyAdsPage } from "@pages/MyAds.page";
import { ProductsPage } from "@pages/Products.page";
import { makeFixture } from "./factories/makeFixture.factory";
import { fillTabsUpTo } from "@utils/fillTabsUpTo";
import { ApiHelper } from "@utils/api/ApiHelper";
import { getAccessToken } from "@utils/api/authToken";
import { adminFile } from "@utils/api/authPaths";
import { BaseFixtures } from "@custom-types/fixtures/all.fixtures.type";

const test = apiAuth.extend<BaseFixtures>({
	unitPage: makeFixture(UnitPage),
	productsPage: makeFixture(ProductsPage),
	favoritePage: makeFixture(FavoriteUnitsPage),
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
		{ box: false, title: "Manage Favorite Units State" },
	],
	myAdsPage: makeFixture(MyAdsPage),
	myAdsUser2Page: [
		async ({ user2Page: page }, use) => {
			await use(new MyAdsPage(page));
		},
		{ box: true },
	],
	authorizedHomePage: makeFixture(HomePage, "home"),
	createUnitPage: makeFixture(CreateUnitPage, "create unit"),
	createUnitPageNewUser: makeFixture(CreateUnitPage, "newUserPage", "create unit"),
	createUnitPageWithFilledTab1: [
		async ({ createUnitPage: _, userPage }, use) => {
			await use(await fillTabsUpTo(userPage, 1));
		},
		{ box: true },
	],
	createUnitPageWithFilledTwoTabs: [
		async ({ createUnitPage: _, userPage }, use) => {
			await use(await fillTabsUpTo(userPage, 2));
		},
		{ box: true },
	],
	createUnitPageWithFilledTwoTabsAndNewService: [
		async ({ createUnitPage: _, userPage, request }, use) => {
			const result = await fillTabsUpTo(userPage, 3, true);
			await use(result);
			await new ApiHelper(request).deleteServiceByName(getAccessToken(adminFile), result.service);
		},
		{ box: true },
	],
	createUnitPageWithFilledThreeTabs: [
		async ({ createUnitPage: _, userPage }, use) => {
			await use(await fillTabsUpTo(userPage, 3));
		},
		{ box: true },
	],
	createUnitPageWithFilledFourTabs: [
		async ({ createUnitPage: _, userPage }, use) => {
			await use(await fillTabsUpTo(userPage, 4));
		},
		{ box: true },
	],
	createUnitPageWithFilledFourTabsNewUser: [
		async ({ createUnitPageNewUser: _, newUserPage }, use) => {
			await use(await fillTabsUpTo(newUserPage, 4));
		},
		{ box: true },
	],
	authorizedUser2HomePage: makeFixture(HomePage, "user2Page", "home"),
	homePage: makeFixture(HomePage, "page"),
});

export { test, expect };
