import { CreateUnitPage } from "@pages/CreateUnit.page";
import { FavoriteUnitsPage } from "@pages/FavoriteUnits.page";
import { HomePage } from "@pages/Home.page";
import { MyAdsPage } from "@pages/MyAds.page";
import { ProductsPage } from "@pages/Products.page";
import { UnitPage } from "@pages/Unit.page";
import endpointsJson from "@constants/endpoints.constants.json";

export type PageFixtures = {
	authorizedHomePage: HomePage;
	authorizedUser2HomePage: HomePage;
	createUnitPage: CreateUnitPage;
	createUnitPageNewUser: CreateUnitPage;
	createUnitPageNewUser2: CreateUnitPage;
	createUnitPageWithFilledTab1: CreateUnitPage;
	createUnitPageWithFilledTwoTabs: CreateUnitPage;
	createUnitPageWithFilledTwoTabsAndNewService: {
		createUnitPage: CreateUnitPage;
		service: string;
	};
	createUnitPageWithFilledThreeTabs: CreateUnitPage;
	createUnitPageWithFilledFourTabs: CreateUnitPage;
	createUnitPageWithFilledFourTabsNewUser: CreateUnitPage;
	createUnitPageWithFilledFourTabsNewUser2: CreateUnitPage;
	unitPage: UnitPage;
	favoritePage: FavoriteUnitsPage;
	favoriteUnitsState: string[];
	productsPage: ProductsPage;
	homePage: HomePage;
	myAdsPage: MyAdsPage;
	myAdsUser2Page: MyAdsPage;
};

export type EndpointKey = {
	[K in keyof typeof endpointsJson]: (typeof endpointsJson)[K] extends string ? K : never;
}[keyof typeof endpointsJson];
