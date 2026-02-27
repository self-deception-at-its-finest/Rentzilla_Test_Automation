import { env } from "../../config/env";
import { AuthenticationComponent } from "../../components/Authentication.component";
import { test } from "../../fixtures/index";
import { CreateUnitPage } from "../../pages/CreateUnit.page";
import { TestAdData } from "../../types/tabs";
import endpoints from "../../constants/endpoints.constants.json";
import { BrowserContext, Page } from "@playwright/test";
import { deleteAdsFlow } from "../../flows/admin/deleteAds.flow";
import { switchToUserFlow } from "../../flows/switchLogins.flow";
import { buildTestAds } from "../../utils/builders/ad.builder";
import { createAdsFlow } from "../../flows/ads/createAds.flow";
import { approveAdsFlow } from "../../flows/admin/approveAds.flow";

test.describe.serial("Testing of ADs setup and teardown", () => {
    let ads: TestAdData[];
    let createUnitPage: CreateUnitPage;
    let context: BrowserContext;
    let page: Page;

    test.beforeAll(async ({ browser }) => {
        context = await browser.newContext();
        page = await context.newPage();

        await page.goto(endpoints.home);
        await new AuthenticationComponent(page).login(env.user);

        ads = buildTestAds(5);
        await createAdsFlow(page, ads);
        await approveAdsFlow(page, ads);

        await switchToUserFlow(page, env.user);
        createUnitPage = new CreateUnitPage(page);
    });

    test.afterAll(async () => {
        await deleteAdsFlow(page, ads);
        await context.close();
    });

    test("Test 1", async () => {
        console.log("Test 1 completed!");
    });

    test("Test 2", async () => {
        console.log("Test 2 completed!");
    });

    test("Test 3", async () => {
        console.log("Test 3 completed");
    });
});
