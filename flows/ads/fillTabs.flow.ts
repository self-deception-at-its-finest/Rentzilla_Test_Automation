import { Page } from "@playwright/test";
import { TestAdData } from "../../types/tabs";
import { AdComponent } from "../../components/create-unit/1/Ad.component";
import { CategoryComponent } from "../../components/create-unit/1/Category.component";
import { LocationComponent } from "../../components/create-unit/1/Location.component";
import { ManufacturerComponent } from "../../components/create-unit/1/Manufacturer.component";
import { PhotosComponent } from "../../components/create-unit/2/Photos.component";
import { ServiceComponent } from "../../components/create-unit/3/Service.component";

export async function fillTab1Flow(page: Page, ad: TestAdData) {
    await new CategoryComponent(page).selectCategory();
    await new AdComponent(page).typeAd(ad.title);
    await new ManufacturerComponent(page).setManufacturer(ad.manufacturer);
    await new LocationComponent(page).selectLocation();
}

export async function fillTab2Flow(page: Page, photo: string) {
    await new PhotosComponent(page).uploadPhoto(photo);
}

export async function fillTab3Flow(page: Page, service: string) {
    await new ServiceComponent(page).typeAndSelectService(service);
}
