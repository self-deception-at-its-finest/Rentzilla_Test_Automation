import type { Locator, Page } from "@playwright/test";

export default class BasePage {
	protected endpoint = "";

    readonly avatarBlock: Locator;
    readonly dropdownAdsItem: Locator;
    readonly sidebarFavoriteAdsVariant: Locator;
    readonly sidebarMyAdsVariant: Locator;

	constructor(protected readonly page: Page) {
        this.avatarBlock = page.getByTestId('avatarBlock');
        this.dropdownAdsItem = page.getByTestId('units');
        this.sidebarFavoriteAdsVariant = page.getByTestId('variant').filter({ hasText: 'Обрані оголошення' });
        this.sidebarMyAdsVariant = page.getByTestId('variant').filter({ hasText: 'Мої оголошення' });
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

    async navigateToMyAds() {
        await this.avatarBlock.click();
        await this.dropdownAdsItem.click();
        await this.sidebarMyAdsVariant.click();
    }
}
