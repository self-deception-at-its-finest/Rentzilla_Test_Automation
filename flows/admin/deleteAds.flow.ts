import { Page } from "@playwright/test";
import { AdminPage } from "../../pages/Admin.page";
import { switchToAdminFlow } from "../switchLogins.flow";
import { env } from "../../config/env";
import { TestAdData } from "../../types/tabs";

export async function deleteAdsFlow(page: Page, ads: TestAdData[]) {
    await switchToAdminFlow(page, env.admin);
    await new AdminPage(page).deleteAds(ads);
}
