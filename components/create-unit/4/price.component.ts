import { Locator, Page } from "@playwright/test";

export class PriceComponent {
    readonly page: Page;
    readonly field: Locator;

    constructor(page: Page) {
        this.page = page;
        this.field = this.page.getByPlaceholder("Наприклад, 1000");
    }

    // TODO create the dynamical price
    // static price for now
    async typePrice(price: string) {
        await this.field.click();
        await this.page.keyboard.type(price);
    }

    async clearTheField() {
        await this.field.fill("");
    }
}
