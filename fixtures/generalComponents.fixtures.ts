import { test as base } from "./base.fixtures";
import { AuthenticationComponent } from "../components/Authentication.component";
import { HeaderComponent } from "../components/Header.component";

type GeneralComponents = {
    authComponent: AuthenticationComponent;
    headerComponent: HeaderComponent;
};

export const test = base.extend<GeneralComponents>({
    authComponent: [
        async ({ page }, use) => {
            await use(new AuthenticationComponent(page));
        },
        { box: true },
    ],
    headerComponent: [
        async ({ page }, use) => {
            await use(new HeaderComponent(page));
        },
        { box: true },
    ],
});
