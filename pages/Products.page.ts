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

        for (let i = 0; i < count; i++) {
            const currentCard = this.unitCards.nth(i);

            // check if the current card is visible, if not - scroll to the last card to trigger loading of new cards
            if (!(await currentCard.isVisible())) {
                await this.unitCards.last().scrollIntoViewIfNeeded();
                // wait a bit for new cards to load
                await this.page.waitForTimeout(800);
            }
            // scroll to the current card to ensure it's in view
            await currentCard.waitFor({ state: 'attached' });
            await currentCard.scrollIntoViewIfNeeded();
            // get unit name
            const name = await currentCard.getByTestId(FAVORITE_UNITS_CONSTS.TESTID.UNIT_NAME).innerText();
            // click heart icon to add to favorites
            const heart = currentCard.getByTestId(FAVORITE_UNITS_CONSTS.TESTID.FAVOURITE);
            // await heart.click({ force: true }); //it is option if clicking becomes unstable, but it can hide potential issues with element visibility or overlapping elements
            await heart.click();
            // add the name to the list of added units and log it
            addedUnitNames.push(name);
            console.log(`Step ${i + 1}: add "${name}"`);
            // wait a bit before moving to the next card
            await this.page.waitForTimeout(300);
        }
        return addedUnitNames;
    }

    async getUnitName(index: number): Promise<string> {
        return await this.unitCards.nth(index).getByTestId(FAVORITE_UNITS_CONSTS.TESTID.UNIT_NAME).innerText()
    }

}