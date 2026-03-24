import type { Locator, Page } from "@playwright/test";

export class FieldActions {
	constructor(private readonly page: Page) {}

	async typeIntoField(field: Locator, str: string) {
		await field.click();
		await this.page.keyboard.type(str);
	}

	async fillInField(field: Locator, str: string) {
		await field.fill(str);
	}

	async clearField(field: Locator) {
		await field.clear();
	}
}
