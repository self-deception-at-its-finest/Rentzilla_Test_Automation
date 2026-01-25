import { expect, test } from "../../fixtures/fixtures";
import endpoints from "../../constants/endpoints.constants.json";
import footerConsts from "../../constants/home-page/footer.constants.json";

test.describe("Home Page Footer Tests", () => {
    
    test("Verify footer elements visibility and navigation",
        {
            tag: "@UI",
            annotation: { type: "Test case", description: "C214" },
        },
        async ({ page, homePage }) => {
        const footer = homePage.footer;

        await test.step("1-11. Visibility: Scroll to footer and check all static elements", async () => {
            await homePage.open();
            await footer.container.scrollIntoViewIfNeeded();

            await expect.soft(footer.getLabelByText(footerConsts.labels.aboutUs)).toBeVisible();
            await expect.soft(footer.getLabelByText(footerConsts.labels.forUsers)).toBeVisible();
            await expect.soft(footer.getLabelByText(footerConsts.labels.contacts)).toBeVisible();
            await expect.soft(footer.copyrightLabel).toBeVisible();

            await expect.soft(footer.logo).toBeVisible();
            // Check that logo is not a link (has no href attribute)
            const logoTagName = await footer.logo.evaluate(el => el.tagName);
            if (logoTagName === 'A') {
                 await expect.soft(footer.logo).not.toHaveAttribute("href");
            }
        });

        await test.step("12. Verify 'Політика конфіденційності' link", async () => {
            await footer.getLinkByText(footerConsts.links.privacy).click();
            await expect.soft(page).toHaveURL(new RegExp(footerConsts.urls.privacy));
            await expect.soft(page.getByRole('heading', { name: footerConsts.expectedTitles.privacyPage })).toBeVisible();
        });

        await test.step("13. Verify 'Правила використання файлів cookie' link", async () => {
            await footer.getLinkByText(footerConsts.links.cookies).click();
            await expect.soft(page).toHaveURL(new RegExp(footerConsts.urls.cookies));
            await expect.soft(page.getByText(footerConsts.expectedTitles.cookiesPage)).toBeVisible();
        });

        await test.step("14. Verify 'Умови доступу та користування' link", async () => {
            await footer.getLinkByText(footerConsts.links.terms).click();
            await expect.soft(page).toHaveURL(new RegExp(footerConsts.urls.terms));
            await expect.soft(page.getByRole('heading', { name: footerConsts.expectedTitles.termsPage })).toBeVisible();
        });

        await test.step("15-16. Verify 'Оголошення' link and return to Home", async () => {
            await footer.getLinkByText(footerConsts.links.ads).click();
            await expect.soft(page).toHaveURL(new RegExp(footerConsts.urls.ads));

            const adsSearch = page.getByPlaceholder(footerConsts.placeholders.adsSearch);
            await expect.soft(adsSearch).toBeVisible();

            await homePage.logo.click();
            await expect.soft(page).toHaveURL(endpoints.home);
            await expect.soft(page.getByText(footerConsts.expectedTitles.mainPageHero)).toBeVisible();
        });

        await test.step("17-18. Verify 'Тендери' link and return to Home", async () => {
            await footer.container.scrollIntoViewIfNeeded();
            await footer.getLinkByText(footerConsts.links.tenders).click();
            await expect.soft(page).toHaveURL(new RegExp(footerConsts.urls.tenders));

            const tendersSearch = page.getByPlaceholder(footerConsts.placeholders.tendersSearch);
            await expect.soft(tendersSearch).toBeVisible();

            await homePage.logo.click();
            await expect.soft(page).toHaveURL(endpoints.home);
        });

        await test.step("18,5. Verify 'Запити на роботу' link and return to Home", async () => {
            await footer.container.scrollIntoViewIfNeeded();
            await footer.getLinkByText(footerConsts.links.requests).click();

            await expect.soft(page).toHaveURL(new RegExp(footerConsts.urls.requests));

            const requestsSearch = page.getByPlaceholder(footerConsts.placeholders.requestsSearch);
            await expect.soft(requestsSearch.first()).toBeVisible();

            await homePage.logo.click();
            await expect.soft(page).toHaveURL(endpoints.home);
        });

        await test.step("19. Verify Email link", async () => {
            await footer.container.scrollIntoViewIfNeeded();
            await expect.soft(footer.getLabelByText(footerConsts.links.email)).toBeVisible();
            await expect.soft(footer.emailLink).toHaveAttribute("href", `mailto:${footerConsts.links.email}`);
        });
    });
});