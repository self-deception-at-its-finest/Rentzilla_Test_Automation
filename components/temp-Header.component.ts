import { Page, Locator } from "@playwright/test";

export class HeaderComponent {
    public page: Page;
    public authenticationButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.authenticationButton = page.getByText("Вхід");
    }
}