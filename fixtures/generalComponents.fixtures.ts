import { test as base } from "./base.fixtures";
import { AuthenticationComponent } from "../components/Authentication.component";

type GeneralComponents = {
    authComponent: AuthenticationComponent;
};

export const test = base.extend<GeneralComponents>({
    authComponent: [
        async ({ page }, use) => {
            await use(new AuthenticationComponent(page));
        },
        { box: true },
    ],
});
