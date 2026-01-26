import { AdComponent } from "../../components/create-unit/1/t-Ad.component";
import { CategoryComponent } from "../../components/create-unit/1/t-Category.component";
import { LocationComponent } from "../../components/create-unit/1/t-Location.component";
import { ManufacturerComponent } from "../../components/create-unit/1/t-Manufacturer.component";
import { PhotosComponent } from "../../components/create-unit/2/t-Photos.component";
import { ServiceComponent } from "../../components/create-unit/3/t-Service.component";
import { PriceComponent } from "../../components/create-unit/4/t-Price.component";
import { ContactsComponent } from "../../components/create-unit/5/t-Contacts.component";
import { HeaderComponent } from "../../components/t-Header.component";
import { TestAdData } from "../../types/tabs";
import { Page } from "@playwright/test";
import { CreateUnitPage } from "../../pages/CreateUnit.page";
/**
 * Entire flow creating of ads
 * @param ads Thе data object for creating new ads
 */
export async function createAdsFlow(page: Page, ads: TestAdData[]) {
    const createUnitPage = new CreateUnitPage(page);
    for (let i = 0; i < ads.length; i++) {
        // First tab

        await new CategoryComponent(page).selectTheCategory();

        await new AdComponent(page).typeAd(ads[i].title);

        await new ManufacturerComponent(page).setTheManufacturer(
            ads[i].manufacturer,
        );

        await new LocationComponent(page).selectLocation();

        await createUnitPage.clickNextButton();

        // Second tab
        await new PhotosComponent(page).uploadPhoto(ads[i].photo);

        await createUnitPage.clickNextButton();

        // Third tab
        // TODO create a random choice of service
        // it’s constant service for now
        await new ServiceComponent(page).typeAndSelectService(ads[i].service);

        await createUnitPage.clickNextButton();

        // Fourth tab
        await new PriceComponent(page).typePrice(ads[i].price);

        await createUnitPage.clickNextButton();

        // Fifth tab
        await new ContactsComponent(page).setAsOperator();
        await createUnitPage.clickNextButton();

        await createUnitPage.successfullCreating.waitFor({ state: "visible" });
        await new HeaderComponent(page).clickCreateAdLink();
    }
}
