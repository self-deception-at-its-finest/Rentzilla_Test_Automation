import {test as base} from "@playwright/test";
import {HomePage} from "../pages/Home.page";
import {AuthenticationComponent} from "../components/Authentication.component";
import {HeaderComponent} from "../components/Header.component";

export const test = base.extend<{
    homePage: HomePage;
    authComponent: AuthenticationComponent;
    headerComponent: HeaderComponent;

}>({
    homePage: async({ page }, use) => {
        await use(new HomePage(page));
    },
    authComponent: async({ page }, use) => {
        await use(new AuthenticationComponent(page));
    },
    headerComponent: async({ page }, use) => {
        await use(new HeaderComponent(page));
    }
})

export {expect, type Page, type Download, type Locator, type TestInfo} from "@playwright/test"