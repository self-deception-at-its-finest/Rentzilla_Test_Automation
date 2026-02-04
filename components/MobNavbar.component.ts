import { Page, Locator } from "@playwright/test";

export class MobNavbarComponent {
    readonly page: Page;
    readonly mobNavbar: Locator;
    readonly profileBtn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.mobNavbar = page.getByTestId("mobileNavbar");
        this.profileBtn = page.getByText("Профіль");
    }

    async clickProfileBtn() {
        await this.profileBtn.click();
    }
}