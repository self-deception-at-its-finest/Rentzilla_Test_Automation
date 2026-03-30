import { test as base } from "./base.fixtures";
import { expect, type Page } from "@playwright/test";
import type { Browser } from "@playwright/test";
import { adminFile, newUserFile, user2File, userFile } from "@utils/api/authPaths";

function createRolePage(roleFile: string) {
	return async ({ browser }: { browser: Browser }, use: (page: Page) => Promise<void>) => {
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
	newUserPage: Page;
	user2Page: Page;
};

export const test = base.extend<MyFixtures>({
	adminPage: createRolePage(adminFile),
	userPage: createRolePage(userFile),
	newUserPage: createRolePage(newUserFile),
	user2Page: createRolePage(user2File),
});

export { expect };
