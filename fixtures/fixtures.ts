import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { CreateUnitPage } from "../pages/create-unit.page";
import { AuthenticationComponent } from "../components/authentication.component";
import { createAds } from "../flows/ads/create-ads.flow";
import endpoints from "../constants/endpoints.constants.json";
import { AdminPage } from "../pages/admin.page";
import { buildTestAds } from "../utils/builders/ad.builder";

type Fixtures = {
    auth: void;
    authorizedHomePage: HomePage;
    authComponent: AuthenticationComponent;
    createUnitPage: CreateUnitPage;
    ads: CreateUnitPage;
    createUnitPageWithAds: CreateUnitPage;
};

export const test = base.extend<Fixtures>({
    authComponent: [
        async ({ page }, use) => {
            await use(new AuthenticationComponent(page));
        },
        { box: true },
    ],

    auth: [
        async ({ authComponent, page }, use) => {
            await page.goto(endpoints.home);
            await authComponent.login({
                email: process.env.USER_EMAIL,
                password: process.env.USER_PASSWORD,
            });
            await use(undefined);
        },
        { box: true },
    ],

    authorizedHomePage: [
        async ({ auth, page }, use) => {
            await page.goto(endpoints.home);
            await use(new HomePage(page));
        },
        { box: true },
    ],

    createUnitPage: [
        async ({ auth, page }, use) => {
            await page.goto(endpoints["create unit"]);
            await use(new CreateUnitPage(page));
        },
        { box: false },
    ],

    /**
     * 1. Creating of test ads
     * 2. Approving of ads via admin
     * 3. Testing
     * 4. Deleting of created ads
     */
    ads: [
        async ({ auth, authComponent, page }, use) => {
            await page.goto(endpoints["create unit"]);
            const createUnitPage = new CreateUnitPage(page);

            // Creating of test ads
            const TEST_ADS_LENGTH = 5;
            // let testAds: TestAdData[] = [];
            // for (let i = 0; i < TEST_ADS_LENGTH; i++) {
            //     testAds[i] = {
            //         title: "new_test_" + generateText(15),
            //         manufacturer: getRandomStringElement(MANUFACTURERS),
            //         photo: "test-photo.png",
            //         service:
            //             SERVICES["agricultural services"].subcategories[
            //                 "agrodrone services"
            //             ].title,
            //         price: "1000",
            //     };
            //     console.log(`Ad title #${i}` + testAds[i].title);
            //     await createUnitPage.createTheAd(testAds[i]);
            //     await page.goto(endpoints["create unit"]);
            // }
            const testAds = buildTestAds(TEST_ADS_LENGTH);
            await createAds(page, testAds);
            // Approving of ads flow
            await authComponent.logout();
            await page.goto(endpoints["admin"]);
            await authComponent.loginAsAdmin({
                email: process.env.ADMIN_EMAIL,
                password: process.env.ADMIN_PASSWORD,
            });
            const adminPage = new AdminPage(page);
            await adminPage.approveAds(testAds);
            // Testing
            await use(createUnitPage);
            // Deleting of created ads
            await adminPage.deleteAds(testAds);
        },
        { box: false },
    ],

    createUnitPageWithAds: async ({ auth, ads, page }, use) => {
        await use(ads);
    },
});

export {
    expect,
    type Page,
    type Download,
    type Locator,
    type TestInfo,
} from "@playwright/test";
