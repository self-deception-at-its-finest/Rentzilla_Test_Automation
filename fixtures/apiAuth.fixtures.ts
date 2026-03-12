import { test as base } from "./base.fixtures";
import { expect, type Page } from "@playwright/test";
import type { Browser } from "@playwright/test";
import { adminFile, userFile } from "@utils/api/authPaths";

function createRolePage(roleFile: string) {
    return async (
        { browser }: { browser: Browser },
        use: (page: Page) => Promise<void>,
    ) => {
        const context = await browser.newContext({
            storageState: roleFile,
        });

        const page = await context.newPage();

        await use(page);

        await context.close();
    };
}

type MyFixtures = {
    adminPage: Page;
    userPage: Page;
};

export const test = base.extend<MyFixtures>({
    adminPage: createRolePage(adminFile),
    userPage: createRolePage(userFile),
});

export { expect };
