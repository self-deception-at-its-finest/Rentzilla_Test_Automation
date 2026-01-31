import { Page } from "@playwright/test";
import { TestAdData } from "../../types/tabs";
import { AdminPage } from "../../pages/Admin.page";

export async function deleteAdsFlow(page: Page, ads: TestAdData[]) {
    const adminPage = new AdminPage(page);
    await adminPage.deleteAds(ads);
}
