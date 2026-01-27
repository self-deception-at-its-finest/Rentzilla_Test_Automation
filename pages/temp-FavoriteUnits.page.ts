import { Locator, Page } from "@playwright/test";
import BasePage from "./temp-Base.page";

export class FavoriteUnitsPage extends BasePage {
    readonly emptyTitle: Locator;
    readonly emptyDescription: Locator;
    readonly goToAdsButton: Locator;

    readonly unitCards: Locator;
    readonly clearListButton: Locator;

    constructor(page: Page) {
        super(page);
        this.emptyTitle = page.getByTestId('title');
        this.emptyDescription = page.getByTestId('descr');
        this.goToAdsButton = page.getByTestId('emptyBlockButton');

        this.unitCards = page.getByTestId('unitCard');
        this.clearListButton = page.locator('button:has-text("Очистити список")');
    }
}