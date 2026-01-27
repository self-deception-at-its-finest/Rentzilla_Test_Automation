import { Locator, Page } from "@playwright/test";
import BasePage from "./temp-Base.page";

export class ProductsPage extends BasePage {
    readonly unitCards: Locator;

    constructor(page: Page) {
        super(page);
        this.unitCards = page.getByTestId('cardWrapper');
    }

    getHeartIconByUnitName(name: string): Locator {
        return this.unitCards
            .filter({ has: this.page.getByText(name) })
            .getByTestId('favourite');
    }
}