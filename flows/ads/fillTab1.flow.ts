import { Page } from "@playwright/test";
import { TestAdData } from "../../types/tabs";
import { AdComponent } from "../../components/create-unit/1/Ad.component";
import { CategoryComponent } from "../../components/create-unit/1/Category.component";
import { LocationComponent } from "../../components/create-unit/1/Location.component";
import { ManufacturerComponent } from "../../components/create-unit/1/Manufacturer.component";

export async function fillTheTab1Flow(page: Page, ad: TestAdData) {
    await new CategoryComponent(page).selectCategory();
    await new AdComponent(page).typeAd(ad.title);
    await new ManufacturerComponent(page).setManufacturer(ad.manufacturer);
    await new LocationComponent(page).selectLocation();
}
