import { Locator, Page } from "@playwright/test";
import BasePage from "./Base.page";

export class FavoriteUnitsPage extends BasePage {
    readonly emptyTitle: Locator;
    readonly emptyDescription: Locator;
    readonly goToAdsButton: Locator;
    readonly unitCards: Locator;
    readonly unitName: Locator;
    readonly clearListButton: Locator;
    readonly confirmDeleteButton: Locator;
    readonly confirmDeleteForm: Locator;
    readonly cancelDeleteButton: Locator;
    readonly canselIcon: Locator;
    readonly searchInput: Locator;
    readonly resetFiltersButton: Locator;
    readonly categoryDropdown: Locator;
    readonly categoryValue: Locator;
    readonly unitCategoryLabel: Locator;
    readonly listContainer: Locator;
    readonly paginationList: Locator;
    readonly prevPageBtn: Locator;
    readonly nextPageBtn: Locator;
    readonly activePage: Locator;
    readonly sortDropdown: Locator;
    readonly sortDropdownValue: Locator;
    readonly unitDates: Locator;

    constructor(page: Page) {
        super(page);
        this.emptyTitle = page.getByTestId('title');
        this.emptyDescription = page.getByTestId('descr');
        this.goToAdsButton = page.getByTestId('emptyBlockButton');
        this.unitCards = page.getByTestId('unitCard');
        this.unitName = this.unitCards.locator('//div[@data-testid="manufacturer"]/preceding-sibling::div[1]'); // this element don't have test id
        // Clear list elements
        this.clearListButton = page.locator('button:has-text("Очистити список")');
        this.confirmDeleteForm = page.getByTestId('content').filter({ hasText: 'Очистити список обраних оголошень?' });
        this.confirmDeleteButton = page.getByTestId('content').getByRole('button', { name: 'Так' });
        this.cancelDeleteButton = page.getByTestId('content').getByRole('button', { name: 'Скасувати' });
        this.canselIcon = page.getByTestId('closeIcon');
        // Filter elements
        this.searchInput = page.getByTestId('search').getByPlaceholder('Заголовок оголошення');
        this.resetFiltersButton = page.getByTestId('emptyBlockButton');
        this.categoryDropdown = page.locator('.SearchPanel_categoryContainer__QRUPt').getByTestId('div_CustomSelect');
        this.categoryValue = this.categoryDropdown.locator('.CustomSelect_value__6zbLK');
        this.unitCategoryLabel = this.unitCards.locator('.OwnerUnitCard_category__fp2Yi');
        this.listContainer = this.page.getByTestId('listItems-customSelect');
        // Pagination elements - don't have test ids
        this.paginationList = page.getByRole('navigation', { name: 'Pagination' });
        this.prevPageBtn = this.paginationList.locator('li.previous');
        this.nextPageBtn = this.paginationList.locator('li.next');
        this.activePage = this.paginationList.locator('li').filter({
            has: page.locator('[aria-current="page"]')
        });
        // Sorting
        this.sortDropdown = page.locator('div[class*="SearchPanel_sortContainer"]').getByTestId('div_CustomSelect');
        this.sortDropdownValue = this.sortDropdown.locator('span').first();
        this.unitDates = this.unitCards.locator('xpath=.//div[text()="."]/following-sibling::div');
    }

    async clearAllFavorites() {
        await this.clearListButton.waitFor({ state: 'visible' }).catch((e) => {
            throw new Error(`Помилка: Кнопка 'Очистити список' не з'явилася. Деталі: ${e.message}`);
        });
        await this.clearListButton.click();
        await this.confirmDeleteButton.click();
    }

    getPageBtn(num: number | string): Locator {
        return this.paginationList.getByRole('button', { name: `Page ${num}` });
    }

    async selectSortOption(optionName: string) {
        await this.sortDropdown.click();
        await this.page.getByRole('listitem').filter({ hasText: optionName }).click();
    }

    async selectCategory(categoryName: string) {
        await this.categoryDropdown.click();
        const listContainer = this.listContainer;
        await listContainer.waitFor({ state: 'visible' });
        const option = listContainer.getByTestId('item-customSelect').filter({ hasText: categoryName });
        await option.click();
    }
}