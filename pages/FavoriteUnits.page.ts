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

    constructor(page: Page) {
        super(page);
        this.emptyTitle = page.getByTestId('title');
        this.emptyDescription = page.getByTestId('descr');
        this.goToAdsButton = page.getByTestId('emptyBlockButton');
        this.unitCards = page.getByTestId('unitCard');
        this.unitName = this.unitCards.locator('.OwnerUnitCard_name__cAZu4'); // this element don't have test id
        this.clearListButton = page.locator('button:has-text("Очистити список")');
        this.confirmDeleteForm = page.getByTestId('content').filter({ hasText: 'Очистити список обраних оголошень?' });
        this.confirmDeleteButton = page.getByTestId('content').getByRole('button', { name: 'Так' });
        this.cancelDeleteButton = page.getByTestId('content').getByRole('button', { name: 'Скасувати' });
        this.canselIcon = page.getByTestId('closeIcon');
        this.searchInput = page.getByTestId('search').getByPlaceholder('Заголовок оголошення');
        this.resetFiltersButton = page.getByTestId('emptyBlockButton');
    }

    async clearAllFavorites() {
        await this.clearListButton.waitFor({ state: 'visible', timeout: 3000 }).catch(() => {
            console.warn("The button 'Очистити список' is not visible after waiting.");
        });

        if (await this.clearListButton.isVisible()) {
            await this.clearListButton.click();
            await this.confirmDeleteButton.click();
        }
        else {
            console.warn("The button 'Очистити список' is not visible.");
        }
    }
}