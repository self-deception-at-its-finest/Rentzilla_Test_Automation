import { expect, test } from "../../fixtures/fixtures"; 
import { ENDPOINTS } from "../../constants/endpoints.constants";
import { markStepAsSkipped } from "../../utils/skip-test";
import { MAIN_PAGE_CONSTS } from "../../constants/home-page/homePage.constants";
import { ProductsPage } from "../../pages/products.page";

test.describe(
    "Home Page tests",
    () => {
        test("Checking 'Послуги' section on the main page",
            {
                tag: "@UI",
                annotation: { type: "Test case", description: "C212" },
            },
            async ({ page, homePage }) => {
                const productsPage = new ProductsPage(page);
                await test.step("1. Open home page and scroll to 'Послуги' section", async () => {
                    await homePage.open();
                    await homePage.servicesSection.scrollIntoViewIfNeeded();
                    await expect(homePage.servicesTitle).toBeVisible();
                    await expect(homePage.servicesTitle).toHaveText(MAIN_PAGE_CONSTS.SERVICES.SECTION_TITLE);
                });

                const tabsCount = await homePage.serviceTabs.count();

                for (let i = 0; i < tabsCount; i++) {
                    const currentTab = homePage.serviceTabs.nth(i);
                    const tabName = await currentTab.innerText();

                    await test.step(`Tab: «${tabName}»`, async () => {
                        await currentTab.click();
                        
                        const servicesCount = await homePage.serviceItems.count();

                        expect.soft(servicesCount, `Is category «${tabName}» empty?`).toBeGreaterThan(0);
                        expect.soft(servicesCount, `Кількість елементів у табі «${tabName}» має бути 7, знайдено ${servicesCount}`).toBe(MAIN_PAGE_CONSTS.SERVICES.EXPECTED_COUNT);

                        if (servicesCount > 0) {
                            await test.step("--- Click on the first service", async () => {
                                await homePage.serviceItems.first().click();
                                await expect(page).toHaveURL(ENDPOINTS.PRODUCTS_RE); 
                            });

                            await test.step("--- Click on the first relevant unit", async () => {
                                    await expect(page).toHaveURL(ENDPOINTS.PRODUCTS_RE);
                                    await productsPage.unitCards.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
                                    const unitsCount = await productsPage.unitCards.count();

                                    if (unitsCount > 0) {
                                        await productsPage.unitCards.first().click();
                                        await expect(page).toHaveURL(ENDPOINTS.UNIT_DETAILS_RE);
                                    } else {
                                        markStepAsSkipped("Selection of a relevant unit", "The website currently has no units in this category.");
                                    }
                                });

                            await test.step("--- Click on the logo to return home", async () => {
                                await homePage.logo.click();
                                await expect(page).toHaveURL(ENDPOINTS.HOME);
                                await homePage.servicesSection.scrollIntoViewIfNeeded();
                            });
                        } else {
                            console.log(`Skipping steps for tab ${tabName}, because it is empty.`);
                        }
                    });
                }
            }
        );

        test("Checking 'Спецтехніка' section on the main page",
            {
                tag: "@UI",
                annotation: { type: "Test case", description: "C213" },
            },
            async ({ page, homePage }) => {
                const productsPage = new ProductsPage(page);
                await test.step("1. Open home page and scroll to Special Equipment section", async () => {
                    await homePage.open();
                    await homePage.specialEquipmentSection.scrollIntoViewIfNeeded();
                    await expect(homePage.specialEquipmentTitle).toBeVisible();
                    await expect(homePage.specialEquipmentTitle).toHaveText(MAIN_PAGE_CONSTS.SPECIAL_EQUIPMENT.SECTION_TITLE);
                });

                const tabsCount = await homePage.specialEquipmentTabs.count();

                for (let i = 0; i < tabsCount; i++) {
                    const currentTab = homePage.specialEquipmentTabs.nth(i);
                    const tabName = await currentTab.innerText();

                    await test.step(`Tab: «${tabName}»`, async () => {
                        await currentTab.click();
                        
                        const itemsCount = await homePage.specialEquipmentItems.count();

                        expect.soft(itemsCount, `Is category «${tabName}» empty?`).toBeGreaterThan(0);
                        expect.soft(itemsCount, `Кількість елементів у табі «${tabName}» має бути 7, знайдено ${itemsCount}`).toBe(MAIN_PAGE_CONSTS.SPECIAL_EQUIPMENT.EXPECTED_COUNT);

                        if (itemsCount > 0) {
                            await test.step("--- Click on the first equipment category", async () => {
                                await homePage.specialEquipmentItems.first().click();
                                await expect(page).toHaveURL(ENDPOINTS.PRODUCTS_RE); 
                            });

                            await test.step("--- Click on the first relevant unit", async () => {
                                await expect(page).toHaveURL(ENDPOINTS.PRODUCTS_RE);
                                await productsPage.unitCards.first().waitFor({ state: 'visible', timeout: 5000 }).catch(() => {});
                                const unitsCount = await productsPage.unitCards.count();

                                if (unitsCount > 0) {
                                    await productsPage.unitCards.first().click();
                                    await expect(page).toHaveURL(ENDPOINTS.UNIT_DETAILS_RE);
                                } else {
                                    markStepAsSkipped("Selection of a relevant unit", "The website currently has no units in this category.");
                                }
                            });                            

                            await test.step("--- Click on the logo to return home", async () => {
                                await homePage.logo.click();
                                await expect(page).toHaveURL(ENDPOINTS.HOME);
                                await homePage.specialEquipmentSection.scrollIntoViewIfNeeded();
                            });
                        } else {
                            console.log(`Skipping steps for tab ${tabName}, because it is empty.`);
                        }
                    });
                }
            }
        );
    }
);