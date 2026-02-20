import { expect, test } from "../../fixtures/index";
import { FAVORITE_UNITS_CONSTS } from "../../constants/favorite-units/favoriteUnits.constants";
import { ENDPOINTS } from "../../constants/endpoints.constants";
import { SPECIAL_EQUIPMENT } from "../../constants/catalog.constants";
import { UnitPage } from "../../pages/Unit.page";

test.describe("Favorite Units Tests", () => {
    test.describe.configure({ mode: 'serial' });

    test("The '" + FAVORITE_UNITS_CONSTS.NAMES.FAVORITE_UNITS + "' page without '" + FAVORITE_UNITS_CONSTS.NAMES.FAVORITES + "' units",
        {
            tag: "@UI",
            annotation: { type: "Test case", description: "C300" },
        },
        async ({ page, authorizedHomePage, favoritePage }) => {

            await test.step(`1. Navigate to '${FAVORITE_UNITS_CONSTS.NAMES.FAVORITE_UNITS}' through Cabinet Sidebar`, async () => {
                await authorizedHomePage.navigateToFavoriteAds();
                await expect(page).toHaveURL(FAVORITE_UNITS_CONSTS.URL);
                await expect(favoritePage.emptyTitle).toHaveText(FAVORITE_UNITS_CONSTS.EMPTY_TITLE);
            });

            await test.step(`2. Click on the '${FAVORITE_UNITS_CONSTS.NAMES.GO_TO_ADS}' button.`, async () => {
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
                await authorizedHomePage.navigateToFavoriteAds();
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

    test("The 'Пошук по назві' search field functionality",
        {
            tag: "@functional",
            annotation: { type: "Test case", description: "C305" },
        },
        async ({ page, authorizedHomePage, favoriteUnitsState, favoritePage }) => {

            await test.step("1. Navigate to 'Обрані' through Cabinet Sidebar", async () => {
                await authorizedHomePage.navigateToFavoriteAds();
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

    test("Check the pagination on the 'Обрані оголошення' page",
        {
            tag: "@UI",
            annotation: { type: "Test case", description: "C311" },
        },
        async ({ page, authorizedHomePage, favoritePage, productsPage }) => {

            await test.step("--- Add units to favorites", async () => {
                await authorizedHomePage.navAdsLink.click();
                await productsPage.addUnitsToFavorites(15);
            });

            await test.step("1. Navigate to 'Обрані' through Cabinet Sidebar", async () => {
                await authorizedHomePage.navigateToFavoriteAds();
                await expect(page).toHaveURL(FAVORITE_UNITS_CONSTS.URL);
                await expect(favoritePage.paginationList).toBeVisible();
            });

            await test.step("2. Verify Page 1 state and '<' button is disabled", async () => {
                await expect(favoritePage.activePage).toHaveText('1');
                await expect(favoritePage.prevPageBtn).toHaveClass(/disabled/);
            });

            await test.step("3. Click '>' and verify Page 2 is highlighted", async () => {
                await favoritePage.nextPageBtn.scrollIntoViewIfNeeded();
                await favoritePage.nextPageBtn.click();
                await expect(favoritePage.activePage).toHaveText('2');
            });

            await test.step("4. Click '>' to Page 3 and verify '>' button is disabled", async () => {
                await favoritePage.nextPageBtn.scrollIntoViewIfNeeded();
                await favoritePage.nextPageBtn.click();
                await expect(favoritePage.activePage).toHaveText('3');

                // when we are on the last page (because we added 15 units) the '>' button should be disabled
                await expect(favoritePage.nextPageBtn).toHaveClass(/disabled/);
            });

            await test.step("5-6. Navigate back to Page 1", async () => {
                await favoritePage.nextPageBtn.scrollIntoViewIfNeeded();
                await favoritePage.prevPageBtn.click(); // to 2
                await expect(favoritePage.activePage).toHaveText('2');
                await favoritePage.nextPageBtn.scrollIntoViewIfNeeded();
                await favoritePage.prevPageBtn.click(); // to 1
                await expect(favoritePage.activePage).toHaveText('1');
            });

            await test.step("7. Final check: Go to the last (3rd) page", async () => {
                const page3 = favoritePage.getPageBtn(3);
                await page3.scrollIntoViewIfNeeded();
                await page3.click();

                await expect(favoritePage.activePage).toHaveText('3');
                await expect(favoritePage.nextPageBtn).toHaveClass(/disabled/);
            });

            await test.step("--- Delete all favorite units", async () => {
                await favoritePage.clearAllFavorites();
            });

        });

    test("'Всі категорії' dropdown menu functionality",
        {
            tag: "@functional",
            annotation: { type: "Test case", description: "C315" },
        },
        async ({ page, authorizedHomePage, favoritePage, unitPage, favoriteUnitsState }) => {
            const categoriesToCheck = [
                SPECIAL_EQUIPMENT.categories["building equipment"].title,   // Будівельна техніка
                SPECIAL_EQUIPMENT.categories["municipal equipment"].title,  // Комунальна техніка
                SPECIAL_EQUIPMENT.categories["warehouse equipment"].title,  // Складська техніка
                // there is agricultural equipment category in the test case, but it is not exist on the site
                //SPECIAL_EQUIPMENT.categories["agricultural equipment"].title,  // Сільськогосподарська техніка
            ];
            const subcategoryMap = {
                [SPECIAL_EQUIPMENT.categories["building equipment"].title]:
                    Object.values(SPECIAL_EQUIPMENT.categories["building equipment"].subcategories).map(s => s.title),
                [SPECIAL_EQUIPMENT.categories["municipal equipment"].title]:
                    Object.values(SPECIAL_EQUIPMENT.categories["municipal equipment"].subcategories).map(s => s.title),
                [SPECIAL_EQUIPMENT.categories["warehouse equipment"].title]:
                    Object.values(SPECIAL_EQUIPMENT.categories["warehouse equipment"].subcategories).map(s => s.title),
            };
            let initialCount: number;

            await test.step("--- Navigate to 'Обрані' and verify initial state", async () => {
                await authorizedHomePage.navigateToFavoriteAds();

                await expect(favoritePage.categoryValue).toHaveText(FAVORITE_UNITS_CONSTS.CATEGORIES.ALL);
                // save the initial count of units to compare later
                initialCount = await favoritePage.unitCards.count();
            });

            for (const category of categoriesToCheck) {
                await test.step(`Select '${category}' and verify units`, async () => {
                    await favoritePage.selectCategory(category);
                    await page.waitForTimeout(500);

                    const count = await favoritePage.unitCards.count();

                    if (count > 0) {
                        await expect(favoritePage.unitCategoryLabel.first()).toContainText(category);
                        // Click on any first unit
                        await favoritePage.unitName.first().click();
                        await expect(page).toHaveURL(/unit/);
                        const actualCategoryText = await unitPage.secondCategory.innerText();
                        const expectedSubs = subcategoryMap[category];
                        // check that the actual subcategory text contains at least one of the expected subcategories for the selected category
                        const isMatch = expectedSubs.some(sub => actualCategoryText.includes(sub));
                        expect(isMatch, FAVORITE_UNITS_CONSTS.CATEGORIES.NOT_ONE_OF(actualCategoryText, expectedSubs)).toBeTruthy();
                        // return back to favorites page
                        await page.goto(FAVORITE_UNITS_CONSTS.URL);
                        await page.waitForURL(FAVORITE_UNITS_CONSTS.URL);
                    } else {
                        // if there are no units in the category, check the empty state message
                        await expect(favoritePage.emptyTitle).toContainText(FAVORITE_UNITS_CONSTS.CATEGORIES.NOT_FOUND(category));
                    }
                });
            }

            await test.step(`--- Return to '${FAVORITE_UNITS_CONSTS.CATEGORIES.ALL}' and verify state`, async () => {
                await favoritePage.selectCategory(FAVORITE_UNITS_CONSTS.CATEGORIES.ALL);
                await expect(favoritePage.categoryValue).toHaveText(FAVORITE_UNITS_CONSTS.CATEGORIES.ALL);

                // check that the count of units is the same as at the beginning
                const finalCount = await favoritePage.unitCards.count();
                expect(finalCount).toBe(initialCount);
            });
        });

    // for now in favoriteUnitsState fixture we are only adding 3 units to favorites, so it could be not enough to check sorting functionality properly
    // but it should be fine if the site is active and the first three units added to the favorites will change from time to time
    test(" 'По даті створення' drop down menu functionality",
        {
            tag: "@functional",
            annotation: { type: "Test case", description: "C316" },
        },
        async ({ page, authorizedHomePage, favoritePage, favoriteUnitsState }) => {

            await test.step("--- Navigate to 'Обрані' through Cabinet Sidebar", async () => {
                await authorizedHomePage.navigateToFavoriteAds();
                await expect(page).toHaveURL(FAVORITE_UNITS_CONSTS.URL);
            });

            await test.step(`1. The '${FAVORITE_UNITS_CONSTS.SORT_OPTIONS.DATE}' section is displayed on the menu`, async () => {
                // it fails without RegExp because received 'по даті створення' instead of 'По даті створення'
                // even if on the UI it looks like 'По даті створення' at the same time
                await expect(favoritePage.sortDropdownValue).toHaveText(new RegExp(FAVORITE_UNITS_CONSTS.SORT_OPTIONS.DATE, 'i'));
                const dateStrings = await favoritePage.unitDates.allInnerTexts();
                if (dateStrings.length > 1) {
                    const dates = dateStrings.map(d => {
                        const [day, month, year] = d.split('.').map(Number);
                        return new Date(year, month - 1, day).getTime();
                    });

                    for (let i = 0; i < dates.length - 1; i++) {
                        expect(dates[i], `Date at index ${i} should be >= date at index ${i + 1}`)
                            .toBeGreaterThanOrEqual(dates[i + 1]);
                    }
                }
            });

            await test.step(`2. Select the '${FAVORITE_UNITS_CONSTS.SORT_OPTIONS.NAME}' section, the unit names are displayed in alphabetical order`, async () => {
                await favoritePage.selectSortOption(FAVORITE_UNITS_CONSTS.SORT_OPTIONS.NAME);
                // wait for sorting to be applied because it fails sometimes without waiting
                await page.waitForTimeout(500);
                await expect(favoritePage.sortDropdownValue).toHaveText(new RegExp(FAVORITE_UNITS_CONSTS.SORT_OPTIONS.NAME, 'i'));
                const names = await favoritePage.unitName.allInnerTexts();
                const sortedNames = [...names].sort((a, b) => {
                    // check if the first character of each name is Latin or not
                    const isLatin = (str: string) => /^[A-Z]/i.test(str);
                    const aIsLatin = isLatin(a);
                    const bIsLatin = isLatin(b);
                    // if one of the names starts with a Latin character and the other doesn't, the one with Latin should come first
                    if (aIsLatin && !bIsLatin) return -1;
                    if (!aIsLatin && bIsLatin) return 1;
                    // if both names are Latin or both are non-Latin, sort them in alphabetical order
                    return a.localeCompare(b, 'uk', { sensitivity: 'base' });
                });

                expect(names).toEqual(sortedNames);
            });

            await test.step(`3. Select the '${FAVORITE_UNITS_CONSTS.SORT_OPTIONS.DATE}' section, the units are sorted by creation date in descending order`, async () => {
                await favoritePage.selectSortOption(FAVORITE_UNITS_CONSTS.SORT_OPTIONS.DATE);
                await page.waitForTimeout(500);
                const dateStrings = await favoritePage.unitDates.allInnerTexts();
                if (dateStrings.length > 1) {
                    // convert date strings to timestamps for easier comparison
                    const dates = dateStrings.map(d => {
                        const [day, month, year] = d.split('.').map(Number);
                        return new Date(year, month - 1, day).getTime();
                    });
                    for (let i = 0; i < dates.length - 1; i++) {
                        expect(dates[i]).toBeGreaterThanOrEqual(dates[i + 1]);
                    }
                }
            });
        });
});