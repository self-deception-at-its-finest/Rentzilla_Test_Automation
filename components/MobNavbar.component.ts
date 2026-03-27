import { Page, Locator } from "@playwright/test";

export class MobNavbarComponent {
	readonly mobNavbar: Locator;
	readonly profileBtn: Locator;

	constructor(readonly page: Page) {
		this.mobNavbar = page.getByTestId("mobileNavbar");
		this.profileBtn = page.getByText("Профіль");
	}

	async clickProfileBtn() {
		await this.profileBtn.click();
	}
}
