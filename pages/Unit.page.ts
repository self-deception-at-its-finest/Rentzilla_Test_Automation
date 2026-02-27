import { Locator, Page } from "@playwright/test";
import BasePage from "./Base.page";

export class UnitPage extends BasePage {
    readonly secondCategory: Locator;

    constructor(page: Page) {
        super(page);
        this.secondCategory = page.getByTestId('secondCategorySpan');
    }
}