import { test as apiAuth } from "./apiAuth.fixtures";
import { expect } from "@playwright/test";
import { HomePage } from "@pages/Home.page";
import { CreateUnitPage } from "@pages/CreateUnit.page";
import endpoints from "@constants/endpoints.constants.json";
import { buildTestAds } from "@utils/builders/ad.builders";
import { fillTab1Flow, fillTab2Flow, fillTab3Flow, fillTab4Flow } from "@flows/ads/fillTabs.flow";
import { generateText } from "@utils/fakeData";
import { ApiHelper } from "@utils/api/ApiHelper";
import { getAccessToken } from "@utils/api/authToken";
import { adminFile } from "@utils/api/authPaths";
import { UnitPage } from "@pages/Unit.page";
import { FavoriteUnitsPage } from "@pages/FavoriteUnits.page";
import { ProductsPage } from "@pages/Products.page";

const test = apiAuth.extend<{
	authorizedHomePage: HomePage;
	createUnitPage: CreateUnitPage;
	createUnitPageNewUser: CreateUnitPage;
	createUnitPageWithFilledTab1: CreateUnitPage;
	createUnitPageWithFilledTwoTabs: CreateUnitPage;
	createUnitPageWithFilledTwoTabsAndNewService: {
		createUnitPage: CreateUnitPage;
		service: string;
	};
	createUnitPageWithFilledThreeTabs: CreateUnitPage;
	createUnitPageWithFilledFourTabs: CreateUnitPage;
	createUnitPageWithFilledFourTabsNewUser: CreateUnitPage;
	unitPage: UnitPage;
	favoritePage: FavoriteUnitsPage;
	favoriteUnitsState: string[];
	productsPage: ProductsPage;
	homePage: HomePage;
}>({
	unitPage: [
		async ({ userPage: page }, use) => {
			await use(new UnitPage(page));
		},
		{ box: true },
	],
	productsPage: [
		async ({ userPage: page }, use) => {
			await use(new ProductsPage(page));
		},
		{ box: true },
	],

	favoritePage: [
		async ({ userPage: page }, use) => {
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
		{ box: false, title: "Manage Favorite Units State" },
	],

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

	createUnitPageNewUser: [
		async ({ newUserPage }, use) => {
			await newUserPage.goto(endpoints["create unit"]);
			await use(new CreateUnitPage(newUserPage));
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
		async ({ createUnitPage, userPage, request }, use) => {
			const ad = buildTestAds(1)[0];
			const service = ad.service + generateText(10);

			await fillTab1Flow(userPage, ad);
			await createUnitPage.nextStep();
			await fillTab2Flow(userPage, ad.photo);
			await createUnitPage.nextStep();

			await use({ createUnitPage, service });
			await new ApiHelper(request).deleteServiceByName(getAccessToken(adminFile), service);
		},
		{ box: false },
	],

	createUnitPageWithFilledThreeTabs: [
		async ({ createUnitPage, userPage }, use) => {
			const ad = buildTestAds(1)[0];
			await fillTab1Flow(userPage, ad);
			await createUnitPage.nextStep();
			await fillTab2Flow(userPage, ad.photo);
			await createUnitPage.nextStep();
			await fillTab3Flow(userPage, ad.service);
			await createUnitPage.nextStep();
			await use(createUnitPage);
		},
		{ box: false },
	],

	createUnitPageWithFilledFourTabs: [
		async ({ createUnitPage, userPage }, use) => {
			const ad = buildTestAds(1)[0];
			await fillTab1Flow(userPage, ad);
			await createUnitPage.nextStep();
			await fillTab2Flow(userPage, ad.photo);
			await createUnitPage.nextStep();
			await fillTab3Flow(userPage, ad.service);
			await createUnitPage.nextStep();
			await fillTab4Flow(userPage, ad.price);
			await createUnitPage.nextStep();
			await use(createUnitPage);
		},
		{ box: false },
	],

	createUnitPageWithFilledFourTabsNewUser: [
		async ({ createUnitPageNewUser, newUserPage }, use) => {
			const ad = buildTestAds(1)[0];
			await fillTab1Flow(newUserPage, ad);
			await createUnitPageNewUser.nextStep();
			await fillTab2Flow(newUserPage, ad.photo);
			await createUnitPageNewUser.nextStep();
			await fillTab3Flow(newUserPage, ad.service);
			await createUnitPageNewUser.nextStep();
			await fillTab4Flow(newUserPage, ad.price);
			await createUnitPageNewUser.nextStep();
			await use(createUnitPageNewUser);
		},
		{ box: false },
	],

	homePage: [
		async ({ page }, use) => {
			await use(new HomePage(page));
		},
		{ box: false },
	],
});

export { test, expect };
