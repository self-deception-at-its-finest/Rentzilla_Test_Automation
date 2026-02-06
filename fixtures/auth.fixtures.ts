import { test as base } from "./generalComponents.fixtures";
import endpoints from "../constants/endpoints.constants.json";
import { env } from "../config/env";

export const test = base.extend<{
    auth: void;
}>({
    auth: [
        async ({ authComponent, page }, use) => {
            await page.goto(endpoints.home);
            await authComponent.login(env.user);
            await use();
        },
        { box: true },
    ],
});
