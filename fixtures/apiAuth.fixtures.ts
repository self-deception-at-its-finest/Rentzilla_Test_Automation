import path from "path";
import { test as base } from "./base.fixtures";
import { expect, type Page } from "@playwright/test";
import type { Browser } from "@playwright/test";

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

const PATH_TO_DATA = path.resolve("playwright/.auth");

type MyFixtures = {
    adminPage: Page;
    userPage: Page;
};

export const test = base.extend<MyFixtures>({
    adminPage: createRolePage(path.join(PATH_TO_DATA, "admin.json")),
    userPage: createRolePage(path.join(PATH_TO_DATA, "user.json")),
});

export { expect };
