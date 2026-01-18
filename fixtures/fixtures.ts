import { test as base } from "@playwright/test";
import { HomePage } from "../pages/home.page";
import { CreateUnitPage } from "../pages/create-unit.page";
import { AuthenticationComponent } from "../components/authentication.component";
import endpoints from "../constants/endpoints.constants.json";

type Fixtures = {
    auth: void;
    authorizedHomePage: HomePage;
    authComponent: AuthenticationComponent;
    createUnitPage: CreateUnitPage;
    homePage: HomePage;
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

    homePage: [
        async ({ page }, use) => {
            await page.goto(endpoints.home);
            await use(new HomePage(page));
        },
        { box: true },
    ],
});

export {
    expect,
    type Page,
    type Download,
    type Locator,
    type TestInfo,
} from "@playwright/test";
