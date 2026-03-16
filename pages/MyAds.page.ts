import type { Page, Locator } from "@playwright/test";
import BasePage from "./Base.page";

export class MyAdsPage extends BasePage {
    readonly emptyTitle: Locator;
    readonly createUnitButton: Locator;

    constructor(page: Page) {
        super(page);
        this.emptyTitle = page.getByTestId('title');
        this.createUnitButton = page.getByTestId('emptyBlockButton');
    }
}