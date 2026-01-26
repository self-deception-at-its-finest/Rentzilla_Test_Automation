import { Page } from "@playwright/test";
import { TestAdData } from "../../types/tabs";
import { AdminPage } from "../../pages/t-Admin.page";

export async function approveAdsFlow(page: Page, ads: TestAdData[]) {
    const adminPage = new AdminPage(page);
    await adminPage.approveAds(ads);
}
