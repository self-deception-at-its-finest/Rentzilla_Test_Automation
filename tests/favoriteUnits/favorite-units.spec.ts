import { expect, test } from "../../fixtures/index";
import { FAVORITE_UNITS_CONSTS } from "../../constants/favorite-units/favoriteUnits.constants";
import { ENDPOINTS } from "../../constants/endpoints.constants";

test.describe("Favorite Units Tests", () => {
    test.describe.configure({ mode: 'serial' });

    test("The 'Обрані оголошення' page without 'Обрані' units",
        {
            tag: "@UI",
            annotation: { type: "Test case", description: "C300" },
        },
        async ({ page, authorizedHomePage, favoritePage }) => {

            await test.step("1. Navigate to 'Обрані' through Cabinet Sidebar", async () => {
                await authorizedHomePage.avatarBlock.click();
                await authorizedHomePage.dropdownAdsItem.click();
                await authorizedHomePage.sidebarFavoriteAdsVariant.click();
                await expect(page).toHaveURL(FAVORITE_UNITS_CONSTS.URL);
                await expect(favoritePage.emptyTitle).toHaveText(FAVORITE_UNITS_CONSTS.EMPTY_TITLE);
            });

            await test.step("2. Click on the 'До списку оголошень' button.", async () => {
                await favoritePage.goToAdsButton.click();
                await expect(page).toHaveURL(ENDPOINTS.PRODUCTS);
                await expect(authorizedHomePage.navAdsLink).toHaveClass(FAVORITE_UNITS_CONSTS.CLASSES.NAVBAR_ACTIVE);
            });
        });

    test("The 'Обрані' icon functionality",
        {
            tag: "@functional",
            annotation: { type: "Test case", description: "C302" },
        },
        async ({ page, authorizedHomePage, productsPage, favoritePage }) => {
            let unitName: string;

            await test.step("1-2. Click on the 'Оголошення' button in the header. Click on the add to 'Обрані оголошення' icon of the unit section.", async () => {
                await authorizedHomePage.navAdsLink.click();
                await expect(page).toHaveURL(ENDPOINTS.PRODUCTS);
                unitName = await productsPage.unitCards.first().getByTestId(FAVORITE_UNITS_CONSTS.TESTID.UNIT_NAME).innerText();
                const heart = productsPage.getHeartIconByUnitName(unitName);

                await heart.click({ force: true });
                await expect(heart.locator(`path[fill="${FAVORITE_UNITS_CONSTS.COLORS.RED_FILL}"]`)).toBeVisible();
            });

            await test.step("3-4. Navigate to 'Обрані оголошення' page", async () => {
                await authorizedHomePage.avatarBlock.click();
                await authorizedHomePage.dropdownAdsItem.click();
                await authorizedHomePage.sidebarFavoriteAdsVariant.click();

                await expect(page).toHaveURL(FAVORITE_UNITS_CONSTS.URL);
                await expect(favoritePage.unitCards.filter({ hasText: unitName })).toBeVisible();
            });

            await test.step("5. Click on the 'Обране' icon of the unit section (Remove from 'Обрані' and verify empty state).", async () => {
                await favoritePage.unitCards.filter({ hasText: unitName }).getByTestId(FAVORITE_UNITS_CONSTS.TESTID.FAVOURITE).click();
                await expect(favoritePage.unitCards).toHaveCount(0);
                await expect(favoritePage.emptyTitle).toHaveText(FAVORITE_UNITS_CONSTS.EMPTY_TITLE);
            });

            await test.step("6. Verify icon state back on Products page", async () => {
                await authorizedHomePage.navAdsLink.click();
                await expect(page).toHaveURL(ENDPOINTS.PRODUCTS);
                const heart = productsPage.getHeartIconByUnitName(unitName);

                await expect(heart.locator(`path[fill="${FAVORITE_UNITS_CONSTS.COLORS.RED_FILL}"]`)).not.toBeVisible();
                await expect(heart.locator(`path[stroke="${FAVORITE_UNITS_CONSTS.COLORS.GREY_STROKE}"]`)).toBeVisible();
            });
        });

    test("The 'Очистити список' button functionality",
        {
            tag: "@functional",
            annotation: { type: "Test case", description: "C303" },
        },
        async ({ page, authorizedHomePage, productsPage, favoritePage }) => {

            let addedUnits: string[] = [];

            await test.step("--- Add 3 units to favorites", async () => {
                await authorizedHomePage.navAdsLink.click();
                addedUnits = await productsPage.addUnitsToFavorites(3);
                console.log("3 units added to favorites");
            });

            await test.step("--- Navigate to 'Обрані' through Cabinet Sidebar", async () => {
                await authorizedHomePage.avatarBlock.click();
                await authorizedHomePage.dropdownAdsItem.click();
                await authorizedHomePage.sidebarFavoriteAdsVariant.click();
                await expect(page).toHaveURL(FAVORITE_UNITS_CONSTS.URL);
            });

            await test.step("1. Click on the 'Очистити список' button, confirmation form is visible", async () => {
                await expect(favoritePage.clearListButton).toBeVisible();
                await favoritePage.clearListButton.click();
                await expect(favoritePage.confirmDeleteForm).toBeVisible();
            });

            await test.step("2. Click on the 'Скасувати' button, confirmation form is closed. 'Обрані' list is displayed", async () => {
                await expect(favoritePage.cancelDeleteButton).toBeVisible();
                await favoritePage.cancelDeleteButton.click();
                await expect(favoritePage.confirmDeleteForm).not.toBeVisible();
                await expect(favoritePage.unitCards.first()).toBeVisible();
            });

            await test.step("3. 'X' (close button) also works", async () => {
                await favoritePage.clearListButton.click();
                await expect(favoritePage.confirmDeleteForm).toBeVisible();
                await favoritePage.canselIcon.click();
                await expect(favoritePage.confirmDeleteForm).not.toBeVisible();
                await expect(favoritePage.unitCards.first()).toBeVisible();
            });

            await test.step("4. The 'Так' button works and clears the list", async () => {
                await favoritePage.clearListButton.click();
                await expect(favoritePage.confirmDeleteForm).toBeVisible();
                await favoritePage.confirmDeleteButton.click();
                await expect(favoritePage.unitCards).toHaveCount(0);
                await expect(favoritePage.emptyTitle).toHaveText(FAVORITE_UNITS_CONSTS.EMPTY_TITLE);
                await expect(favoritePage.emptyDescription).toHaveText(FAVORITE_UNITS_CONSTS.EMPTY_DESCRIPTION);
                await expect(favoritePage.confirmDeleteForm).not.toBeVisible();
            });

            await test.step("5. The previously selected 'Обране' icon on the products list is inactive (not red)", async () => {
                await expect(favoritePage.goToAdsButton).toBeVisible();
                await favoritePage.goToAdsButton.click();
                await expect(page).toHaveURL(ENDPOINTS.PRODUCTS);

                for (const unitName of addedUnits) {
                    // get heart icon for each previously added unit
                    const heart = productsPage.getHeartIconByUnitName(unitName);
                    // check that the heart icon is not filled with red color (not active)
                    await expect(heart.locator(`path[fill="${FAVORITE_UNITS_CONSTS.COLORS.RED_FILL}"]`)).not.toBeVisible();
                    await expect(heart.locator(`path[stroke="${FAVORITE_UNITS_CONSTS.COLORS.GREY_STROKE}"]`)).toBeVisible();
                }
            });
        });

    // in progress
    test("The 'Пошук по назві' search field functionality",
        {
            tag: "@functional",
            annotation: { type: "Test case", description: "C305" },
        },
        async ({ page, authorizedHomePage, favoriteUnitsState, favoritePage }) => {

            await test.step("1. Navigate to 'Обрані' through Cabinet Sidebar", async () => {
                await authorizedHomePage.avatarBlock.click();
                await authorizedHomePage.dropdownAdsItem.click();
                await expect(page).toHaveURL(ENDPOINTS.OWNER_UNITS);
                await authorizedHomePage.sidebarFavoriteAdsVariant.click();
                await expect(page).toHaveURL(FAVORITE_UNITS_CONSTS.URL);
            });

            await test.step("2-3. Click on search input and press Enter", async () => {
                await favoritePage.searchInput.click();
                await favoritePage.searchInput.press('Enter');
                await expect(favoritePage.unitCards).toHaveCount(favoriteUnitsState.length);
            });

            await test.step("4. Enter only spaces in the search input", async () => {
                const spaces = [" ", "  ", "          "];
                for (const space of spaces) {
                    await favoritePage.searchInput.fill(space);
                    await favoritePage.searchInput.press('Enter');
                    await expect(favoritePage.searchInput).toHaveValue(space);
                }
            });

            await test.step("5. Click on the 'Скинути фільтри' button", async () => {
                // We can enter something here, but for now spases in enough as wrong input
                //await favoritePage.searchInput.fill("NonExistentUnit123");
                await favoritePage.resetFiltersButton.click();
                await expect(favoritePage.searchInput).toHaveValue("");
                await expect(favoritePage.unitCards).toHaveCount(favoriteUnitsState.length);
            });

            await test.step("6. Enter '16' in the 'Пошук по назві' input", async () => {
                const query = "16";
                await favoritePage.searchInput.fill(query);
                await favoritePage.searchInput.press('Enter');

                // wait wor results to load and check if there are any cards with "16" in the title
                const count = await favoritePage.unitCards.count();
                if (count > 0) {
                    // if there are results, check that at least the first one contains "16" in the title
                    await expect(favoritePage.unitCards.first()).toContainText(query);
                } else {
                    // if there are no results, check that the empty state message is correct and contains "16"
                    await expect(favoritePage.emptyTitle).toContainText(`Оголошення за назвою "${query}" не знайдені`);
                    await expect(favoritePage.resetFiltersButton).toBeVisible();
                    await favoritePage.resetFiltersButton.click();
                }
            });

            await test.step("7. Enter specific symbols in the 'Пошук по назві' input", async () => {
                const symbols = "!, @, #, $, %, <, >, ^, (, ), *";
                await favoritePage.searchInput.fill(symbols);
                await favoritePage.searchInput.press('Enter');

                const count = await favoritePage.unitCards.count();
                if (count > 0) {
                    await expect(favoritePage.unitCards.first()).toBeVisible();
                } else {
                    await expect(favoritePage.emptyTitle).toContainText(`Оголошення за назвою "${symbols}" не знайдені`);
                    await expect(favoritePage.resetFiltersButton).toBeVisible();
                    await favoritePage.resetFiltersButton.click();
                }
            });

            await test.step("8. Enter the non-existing keyword 'тест1234567890'", async () => {
                const nonExistentKey = "тест1234567890";
                await favoritePage.searchInput.fill(nonExistentKey);
                await favoritePage.searchInput.press('Enter');

                // have to be no results and the empty state message should contain the non-existing keyword
                await expect(favoritePage.emptyTitle).toContainText(`Оголошення за назвою "${nonExistentKey}" не знайдені`);
                await expect(favoritePage.resetFiltersButton).toBeVisible();
                await favoritePage.resetFiltersButton.click();
            });

            await test.step("9. Search by existing unit title", async () => {
                // get the title of the first unit in the list
                const titleFromUI = await favoritePage.unitName.first().innerText();
                console.log(`Searching for: ${titleFromUI}`);

                await favoritePage.searchInput.fill(titleFromUI);
                await favoritePage.searchInput.press('Enter');

                // check that there is exactly 1 result and it contains the title we searched for
                await expect(favoritePage.unitCards).toHaveCount(1);
                await expect(favoritePage.unitName.first()).toHaveText(titleFromUI);
            });
        });
});