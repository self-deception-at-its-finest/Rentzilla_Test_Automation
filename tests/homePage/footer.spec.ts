import { expect, test } from "../../fixtures/index";
import { ENDPOINTS } from "../../constants/endpoints.constants";
import { FOOTER_CONSTS } from "../../constants/home-page/footer.constants";

test.describe("Home Page Footer Tests", () => {
    
    test("Verify footer elements visibility and navigation",
        {
            tag: "@UI",
            annotation: { type: "Test case", description: "C214" },
        },
        async ({ page, homePage }) => {
        const footer = homePage.footer;

        await test.step("1-11. Visibility: scroll to footer and check all static elements", async () => {
            await homePage.open();
            await footer.container.scrollIntoViewIfNeeded();

            await expect.soft(footer.getLabelByText(FOOTER_CONSTS.LABELS.ABOUT_US)).toBeVisible();
            await expect.soft(footer.getLabelByText(FOOTER_CONSTS.LABELS.FOR_USERS)).toBeVisible();
            await expect.soft(footer.getLabelByText(FOOTER_CONSTS.LABELS.CONTACTS)).toBeVisible();
            await expect.soft(footer.copyrightLabel).toBeVisible();
            await expect.soft(footer.logo).toBeVisible();
            // Check that logo is not a link (has no href attribute)
            const logoTagName = await footer.logo.evaluate(el => el.tagName);
            if (logoTagName === 'A') {
                 await expect.soft(footer.logo).not.toHaveAttribute("href");
            }
        });

        // Footer Links Verification - we don`t return to home page after each link check - finding footer and clicking next link from there
        await test.step("12. Verify 'Політика конфіденційності' link", async () => {
            await footer.getLinkByText(FOOTER_CONSTS.LINKS.PRIVACY).click();
            await expect.soft(page).toHaveURL(ENDPOINTS.PRIVACY);
            await expect.soft(page.getByRole('heading', { name: FOOTER_CONSTS.EXPECTED_TITLES.PRIVACY_PAGE })).toBeVisible();
        });

        await test.step("13. Verify 'Правила використання файлів cookie' link", async () => {
            await footer.getLinkByText(FOOTER_CONSTS.LINKS.COOKIES).click();
            await expect.soft(page).toHaveURL(ENDPOINTS.COOKIES);
            await expect.soft(page.getByText(FOOTER_CONSTS.EXPECTED_TITLES.COOKIES_PAGE)).toBeVisible();
        });

        await test.step("14. Verify 'Умови доступу та користування' link", async () => {
            await footer.getLinkByText(FOOTER_CONSTS.LINKS.TERMS).click();
            await expect.soft(page).toHaveURL(ENDPOINTS.TERMS);
            await expect.soft(page.getByRole('heading', { name: FOOTER_CONSTS.EXPECTED_TITLES.TERMS_PAGE })).toBeVisible();
        });

        // In the following steps we return to Home page after each link check
        await test.step("15-16. Verify 'Оголошення' link and return to Home", async () => {
            await footer.getLinkByText(FOOTER_CONSTS.LINKS.ADS).click();
            await expect.soft(page).toHaveURL(ENDPOINTS.PRODUCTS);

            const adsSearch = page.getByPlaceholder(FOOTER_CONSTS.PLACEHOLDERS.ADS_SEARCH);
            await expect.soft(adsSearch).toBeVisible();

            await homePage.logo.click();
            await expect.soft(page).toHaveURL(ENDPOINTS.HOME);
            await expect.soft(page.getByText(FOOTER_CONSTS.EXPECTED_TITLES.MAIN_PAGE_HERO)).toBeVisible();
        });

        await test.step("17-18. Verify 'Тендери' link and return to Home", async () => {
            await footer.container.scrollIntoViewIfNeeded();
            await footer.getLinkByText(FOOTER_CONSTS.LINKS.TENDERS).click();
            await expect.soft(page).toHaveURL(ENDPOINTS.TENDERS);

            const tendersSearch = page.getByPlaceholder(FOOTER_CONSTS.PLACEHOLDERS.TENDERS_SEARCH);
            await expect.soft(tendersSearch).toBeVisible();

            await homePage.logo.click();
            await expect.soft(page).toHaveURL(ENDPOINTS.HOME);
        });

        await test.step("18,5. Verify 'Запити на роботу' link and return to Home", async () => {
            await footer.container.scrollIntoViewIfNeeded();
            await footer.getLinkByText(FOOTER_CONSTS.LINKS.REQUESTS).click();

            await expect.soft(page).toHaveURL(ENDPOINTS.REQUESTS);

            const requestsSearch = page.getByPlaceholder(FOOTER_CONSTS.PLACEHOLDERS.REQUESTS_SEARCH);
            await expect.soft(requestsSearch.first()).toBeVisible();

            await homePage.logo.click();
            await expect.soft(page).toHaveURL(ENDPOINTS.HOME);
        });

        await test.step("19. Verify Email link", async () => {
            await footer.container.scrollIntoViewIfNeeded();
            await expect.soft(footer.getLabelByText(FOOTER_CONSTS.LINKS.EMAIL)).toBeVisible();
            await expect.soft(footer.emailLink).toHaveAttribute("href", `mailto:${FOOTER_CONSTS.LINKS.EMAIL}`);
        });
    });
});