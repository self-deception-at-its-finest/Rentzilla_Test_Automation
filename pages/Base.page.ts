import { expect, type Locator, type Page } from "@playwright/test";

export default class BasePage {
    protected readonly page: Page;
    protected endpoint = "";

    readonly avatarBlock: Locator;
    readonly dropdownAdsItem: Locator;
    readonly sidebarFavoriteAdsVariant: Locator;

    constructor(page: Page) {
        this.page = page;

        this.avatarBlock = page.getByTestId('avatarBlock');
        this.dropdownAdsItem = page.getByTestId('units');
        this.sidebarFavoriteAdsVariant = page.getByTestId('variant').filter({ hasText: 'Обрані оголошення' });
    }

    /**
     * Opens the page with the given path.
     * @param path
     */
    async open(path = ''): Promise<void> {
        await this.page.goto('/' + path, {
            waitUntil: 'domcontentloaded',
        });
    }

    async navigateToFavoriteAds() {
        await this.avatarBlock.click();
        await this.dropdownAdsItem.click();
        await this.sidebarFavoriteAdsVariant.click();
    }
}
