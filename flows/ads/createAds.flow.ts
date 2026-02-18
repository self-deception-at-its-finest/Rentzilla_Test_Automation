import { PhotosComponent } from "../../components/create-unit/2/Photos.component";
import { ServiceComponent } from "../../components/create-unit/3/Service.component";
import { PriceComponent } from "../../components/create-unit/4/Price.component";
import { ContactsComponent } from "../../components/create-unit/5/Contacts.component";
import { HeaderComponent } from "../../components/Header.component";
import { TestAdData } from "../../types/tabs";
import { Page } from "@playwright/test";
import { CreateUnitPage } from "../../pages/CreateUnit.page";
import { fillTab1Flow } from "./fillTab1.flow";
import endpoints from "../../constants/endpoints.constants.json";

/**
 * Entire flow creating of ads
 * @param ads Thе data object for creating new ads
 */
export async function createAdsFlow(page: Page, ads: TestAdData[]) {
    await page.goto(endpoints["create unit"]);

    const createUnitPage = new CreateUnitPage(page);
    for (let i = 0; i < ads.length; i++) {
        // First tab
        await fillTab1Flow(page, ads[i]);
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
