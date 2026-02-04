import { Locator, Page } from "@playwright/test";

export class ServiceComponent {
    readonly page: Page;
    readonly section: Locator;
    readonly field: Locator;

    constructor(page: Page) {
        this.page = page;
        this.section = this.page.getByTestId("searchResult");
        this.field = this.section.getByRole("textbox");
    }

    async typeAndSelectService(str: string) {
        await this.field.click();
        await this.page.keyboard.type(str);
        await this.page.keyboard.press("Tab");
        await this.page.keyboard.press("Enter");
    }

    async clearField() {
        await this.field.fill("");
    }
}
