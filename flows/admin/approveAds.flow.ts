import { Page } from "@playwright/test";
import { env } from "../../config/env";
import { AdminPage } from "../../pages/Admin.page";
import { TestAdData } from "../../types/tabs";
import { switchToAdminFlow } from "../switchLogins.flow";

export async function approveAdsFlow(page: Page, ads: TestAdData[]) {
    await switchToAdminFlow(page, env.admin);
    await new AdminPage(page).approveAds(ads);
}
