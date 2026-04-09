import type { Browser, Page } from "@playwright/test";
import fs from "fs";

export function makeRolePage(roleFile: string) {
	return async ({ browser }: { browser: Browser }, use: (page: Page) => Promise<void>) => {
		if (!roleFile || !fs.existsSync(roleFile)) {
			await use(null as unknown as Page);
			return;
		}

		const context = await browser.newContext({
			storageState: roleFile,
		});

		const page = await context.newPage();

		await use(page);

		await context.close();
	};
}
