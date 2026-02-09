import { Locator, Page } from "@playwright/test";
import BasePage from "./Base.page";
import { FAVORITE_UNITS_CONSTS } from "../constants/favorite-units/favoriteUnits.constants";

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

    async addUnitsToFavorites(count: number): Promise<string[]> {
        const addedUnitNames: string[] = [];
        await this.unitCards.first().waitFor({ state: 'visible', timeout: 10000 });
        // get total available cards
        const availableCount = await this.unitCards.count();
        // get the minimum between requested count and available cards
        const limit = Math.min(count, availableCount);

        for (let i = 0; i < limit; i++) {
            const currentCard = this.unitCards.nth(i);
            // get unit name
            const name = await currentCard.getByTestId(FAVORITE_UNITS_CONSTS.TESTID.UNIT_NAME).innerText();
            addedUnitNames.push(name);
            // click heart icon to add to favorites
            const heart = currentCard.getByTestId(FAVORITE_UNITS_CONSTS.TESTID.FAVOURITE);
            await heart.click({ force: true });
        }

        return addedUnitNames; // return names of added units
    }

}