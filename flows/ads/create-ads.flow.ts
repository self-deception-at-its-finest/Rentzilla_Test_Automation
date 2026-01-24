import { AdComponent } from "../../components/create-unit/1/ad.component";
import { CategoryComponent } from "../../components/create-unit/1/category.component";
import { LocationComponent } from "../../components/create-unit/1/location.component";
import { ManufacturerComponent } from "../../components/create-unit/1/manufacturer.component";
import { PhotosComponent } from "../../components/create-unit/2/photos.component";
import { ServiceComponent } from "../../components/create-unit/3/service.component";
import { PriceComponent } from "../../components/create-unit/4/price.component";
import { ContactsComponent } from "../../components/create-unit/5/contacts.component";
import { HeaderComponent } from "../../components/header.component";
import { TestAdData } from "../../types/tabs";
import { Page } from "@playwright/test";
import { CreateUnitPage } from "../../pages/create-unit.page";
/**
 * Entire flow creating of ads
 * @param testAds Thе data object for creating new ads
 */
export async function createAds(page: Page, testAds: TestAdData[]) {
    const createUnitPage = new CreateUnitPage(page);
    for (let i = 0; i < testAds.length; i++) {
        // First tab

        await new CategoryComponent(page).selectTheCategory();

        await new AdComponent(page).typeAd(testAds[i].title);

        await new ManufacturerComponent(page).setTheManufacturer(
            testAds[i].manufacturer,
        );

        await new LocationComponent(page).selectLocation();

        await createUnitPage.clickNextButton();

        // Second tab
        await new PhotosComponent(page).uploadPhoto(testAds[i].photo);

        await createUnitPage.clickNextButton();

        // Third tab
        // TODO create a random choice of service
        // it’s constant service for now
        await new ServiceComponent(page).typeAndSelectService(
            testAds[i].service,
        );

        await createUnitPage.clickNextButton();

        // Fourth tab
        await new PriceComponent(page).typePrice(testAds[i].price);

        await createUnitPage.clickNextButton();

        // Fifth tab
        await new ContactsComponent(page).setAsOperator();
        await createUnitPage.clickNextButton();

        await createUnitPage.successfullCreating.waitFor({ state: "visible" });
        await new HeaderComponent(page).clickCreateAdLink();
    }
}
