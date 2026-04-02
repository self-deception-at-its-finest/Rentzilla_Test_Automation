import type { Browser, Page } from "@playwright/test";

export function makeRolePage(roleFile: string) {
	return async ({ browser }: { browser: Browser }, use: (page: Page) => Promise<void>) => {
		const context = await browser.newContext({
			storageState: roleFile,
		});

		const page = await context.newPage();

		await use(page);

		await context.close();
	};
}
