import { expect, test } from "../../fixtures/fixtures";
import { FavoriteUnitsPage } from "../../pages/FavoriteUnits.page";
import { ProductsPage } from "../../pages/Products.page";
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
            tag: "@UI",
            annotation: { type: "Test case", description: "C302" },
        },
        async ({ page, authorizedHomePage, productsPage, favoritePage }) => {
        let unitName: string;

        await test.step("1-2. 1. Click on the 'Оголошення' button in the header. Click on the add to 'Обрані оголошення' icon of the unit section.", async () => {
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
});