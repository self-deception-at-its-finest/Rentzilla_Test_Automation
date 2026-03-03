import { test as base } from "./apiAuth.fixtures";
import { AuthenticationComponent } from "../components/Authentication.component";
import { HeaderComponent } from "../components/Header.component";

type GeneralComponents = {
    authComponent: AuthenticationComponent;
    headerComponent: HeaderComponent;
};

export const test = base.extend<GeneralComponents>({
    authComponent: [
        async ({ userPage }, use) => {
            await use(new AuthenticationComponent(userPage));
        },
        { box: true },
    ],
    headerComponent: [
        async ({ userPage }, use) => {
            await use(new HeaderComponent(userPage));
        },
        { box: true },
    ],
});
