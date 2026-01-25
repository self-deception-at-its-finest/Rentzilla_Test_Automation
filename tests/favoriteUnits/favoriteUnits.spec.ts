import { expect, test } from "../../fixtures/fixtures";
import { FavoriteUnitsPage } from "../../pages/favoriteUnits.page";
import { ProductsPage } from "../../pages/products.page";

test.describe("Favorite Units Tests", () => {
    test.describe.configure({ mode: 'serial' });
    
    test("The 'Обрані оголошення' page without 'Обрані' units", 
        {
            tag: "@UI",
            annotation: { type: "Test case", description: "C300" },
        },
        async ({ page, authorizedHomePage }) => {
        const favoritePage = new FavoriteUnitsPage(page);

        await test.step("1. Navigate to Favorites through Cabinet Sidebar", async () => {
            await authorizedHomePage.avatarBlock.click();
            await authorizedHomePage.dropdownAdsItem.click();
            await authorizedHomePage.sidebarFavoriteAdsVariant.click();
            await expect(page).toHaveURL(/.*owner-favourite-units.*/);
        });

        await test.step("2. Verify empty state", async () => {
            await expect(favoritePage.emptyTitle).toHaveText("У Вас поки немає обраних оголошень");
            await favoritePage.goToAdsButton.click();
        });

        await test.step("3. Verify redirection to Ads", async () => {
            await expect(page).toHaveURL(/.*\/products\//);
            await expect(authorizedHomePage.navAdsLink).toHaveClass(/.*Navbar_active.*/);
        });
    });

    test("The 'Обрані' icon functionality", 
        {
            tag: "@UI",
            annotation: { type: "Test case", description: "C302" },
        },
        async ({ page, authorizedHomePage }) => {
        const productsPage = new ProductsPage(page);
        const favoritePage = new FavoriteUnitsPage(page);
        let unitName: string;

        await test.step("1. Go to Products and select a unit", async () => {
            await authorizedHomePage.navAdsLink.click();
            await expect(page).toHaveURL(/.*\/products\//);
            unitName = await productsPage.unitCards.first().getByTestId('unitName').innerText();
            const heart = productsPage.getHeartIconByUnitName(unitName);
            await heart.click();
            await expect(heart.locator('path[fill="#F73859"]')).toBeVisible();
        });

        await test.step("2. Navigate to Favorite Units page", async () => {
            await authorizedHomePage.avatarBlock.click();
            await authorizedHomePage.dropdownAdsItem.click();
            await authorizedHomePage.sidebarFavoriteAdsVariant.click(); 
            
            await expect(page).toHaveURL(/.*owner-favourite-units.*/);
            await expect(favoritePage.unitCards.filter({ hasText: unitName })).toBeVisible();
        });

        await test.step("3. Remove from favorites and verify empty state", async () => {
            await favoritePage.unitCards.filter({ hasText: unitName }).getByTestId('favourite').click();
            await expect(favoritePage.unitCards).toHaveCount(0);
            await expect(favoritePage.emptyTitle).toHaveText("У Вас поки немає обраних оголошень");
        });

        await test.step("4. Verify icon state back on Products page", async () => {
            await authorizedHomePage.navAdsLink.click();
            await expect(page).toHaveURL(/.*\/products\//);
            const heart = productsPage.getHeartIconByUnitName(unitName);
            await expect(heart.locator('path[fill="#F73859"]')).not.toBeVisible();
            await expect(heart.locator('path[stroke="#404B69"]')).toBeVisible();
        });
    });
});