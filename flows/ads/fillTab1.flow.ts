import { Page } from "@playwright/test";
import { TestAdData } from "@custom-types/tabs.types";
import { AdComponent } from "@components/create-unit/1/sections/Ad.component";
import { CategoryComponent } from "@components/create-unit/1/sections/Category.component";
import { LocationComponent } from "@components/create-unit/1/sections/Location.component";
import { ManufacturerComponent } from "@components/create-unit/1/sections/Manufacturer.component";

export async function fillTab1Flow(page: Page, ad: TestAdData) {
	await new CategoryComponent(page).selectCategory();
	await new AdComponent(page).typeAd(ad.title);
	await new ManufacturerComponent(page).setManufacturer(ad.manufacturer);
	await new LocationComponent(page).selectLocation();
}
