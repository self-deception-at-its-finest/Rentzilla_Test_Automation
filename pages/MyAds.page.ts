import type { Page, Locator } from "@playwright/test";
import BasePage from "./Base.page";
import { FieldActions } from "@components/create-unit/FieldActions";

export class MyAdsPage extends BasePage {
    readonly fieldActions: FieldActions;
    readonly emptyTitle: Locator;
    readonly createUnitButton: Locator;
    readonly unitCards: Locator;
    readonly categorySelect: Locator;
    readonly selectOptions: Locator;
    readonly unitCategoryLabel: Locator;
    readonly sortDropdown: Locator;
    readonly unitNames: Locator;
    readonly unitDates: Locator;
    readonly resetFiltersBtn: Locator;
    readonly searchInput: Locator;

    constructor(page: Page) {
        super(page);
        this.fieldActions = new FieldActions(page);
        this.emptyTitle = page.getByTestId('title');
        this.createUnitButton = page.getByTestId('emptyBlockButton');
        this.unitCards = page.getByTestId('unitCard');
        this.categorySelect = this.page.getByTestId('div_CustomSelect').first();
        this.selectOptions = this.page.getByTestId('item-customSelect');
        this.unitCategoryLabel = this.page.locator('div[class*="OwnerUnitCard_category__"]');
        this.sortDropdown = this.page.getByTestId('div_CustomSelect').last();
        this.unitNames = this.page.locator('.OwnerUnitCard_name__cAZu4');
        this.unitDates = this.page.locator('.OwnerUnitCard_ownerDateWithDot__Ki52T');
        this.resetFiltersBtn = this.page.getByTestId('emptyBlockButton');
        this.searchInput = this.page.getByTestId('input');
    }

    getTab(tabName: string): Locator {
        return this.page.getByRole('tab', { name: tabName });
    }

    async switchTab(tabName: string) {
        await this.getTab(tabName).click();
    }

    async selectCategory(categoryName: string) {
        await this.categorySelect.click();
        await this.selectOptions.filter({ hasText: categoryName }).click();
    }

    async selectSortOption(optionName: string) {
        await this.sortDropdown.click();
        await this.page.getByTestId('item-customSelect').filter({ hasText: optionName }).click();
    }

    async getVisibleUnitNames(): Promise<string[]> {
        return await this.unitNames.allInnerTexts();
    }

    async deleteSearchTextSequentially() {
        const currentText = await this.searchInput.inputValue();
        for (let i = 0; i < currentText.length; i++) {
            await this.searchInput.press('Backspace');
        }
    }

    async isCardsVisible() {
        return await this.unitCards.first().isVisible();
    }

    async clearSearch() {
        await this.fieldActions.clearField(this.searchInput);
    }
}