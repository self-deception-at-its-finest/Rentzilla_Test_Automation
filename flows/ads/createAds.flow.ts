import { AdComponent } from "../../components/create-unit/1/Ad.component";
import { CategoryComponent } from "../../components/create-unit/1/Category.component";
import { LocationComponent } from "../../components/create-unit/1/Location.component";
import { ManufacturerComponent } from "../../components/create-unit/1/Manufacturer.component";
import { PhotosComponent } from "../../components/create-unit/2/Photos.component";
import { ServiceComponent } from "../../components/create-unit/3/Service.component";
import { PriceComponent } from "../../components/create-unit/4/Price.component";
import { ContactsComponent } from "../../components/create-unit/5/Contacts.component";
import { HeaderComponent } from "../../components/Header.component";
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

        await createUnitPage.nextStep();

        // Second tab
        await new PhotosComponent(page).uploadPhoto(ads[i].photo);

        await createUnitPage.nextStep();

        // Third tab
        // TODO create a random choice of service
        // it’s constant service for now
        await new ServiceComponent(page).typeAndSelectService(ads[i].service);

        await createUnitPage.nextStep();

        // Fourth tab
        await new PriceComponent(page).typePrice(ads[i].price);

        await createUnitPage.nextStep();

        // Fifth tab
        await new ContactsComponent(page).setAsOperator();
        await createUnitPage.nextStep();

        await createUnitPage.successfullCreating.waitFor({ state: "visible" });
        await new HeaderComponent(page).clickCreateAdLink();
    }
}
