import { expect, test } from "../../fixtures/fixtures"; 
import endpoints from "../../constants/endpoints.constants.json";
import { markStepAsSkipped } from "../../utils/skip-test";
import mainPageConsts from "../../constants/home-page/home-page.constants.json";

test.describe(
    "Home Page tests",
    () => {
        test("Checking *Послуги* section on the main page",
            {
                tag: "@UI",
                annotation: { type: "Test case", description: "C212" },
                    },
            async ({ page, homePage }) => {
                
                await test.step("1. Open home page and scroll to Services section", async () => {
                    await homePage.open();
                    await homePage.servicesSection.scrollIntoViewIfNeeded();
                    await expect(homePage.servicesTitle).toBeVisible();
                    await expect(homePage.servicesTitle).toHaveText(mainPageConsts.services.sectionTitle);
                });

                const tabsCount = await homePage.serviceTabs.count();

                for (let i = 0; i < tabsCount; i++) {
                    const currentTab = homePage.serviceTabs.nth(i);
                    const tabName = await currentTab.innerText();

                    await test.step(`Tab: «${tabName}»`, async () => {
                        await currentTab.click();
                        
                        const servicesCount = await homePage.serviceItems.count();

                        // use expect.soft to not stop the test on failure
                        // Test checks that there is at least one service in the selected tab
                        expect.soft(servicesCount, `Category «${tabName}» is empty!`).toBeGreaterThan(0);

                        if (servicesCount > 0) {
                            await test.step("--- Click on the first service", async () => {
                                await homePage.serviceItems.first().click();
                                await expect(page).toHaveURL(/.*products.*/); 
                            });

                            await test.step("--- [SKIPPED] Click on the first relevant unit", async () => {
                                markStepAsSkipped("Selection of a relevant unit", "The website currently has no units.");
                            });

                            await test.step("--- Click on the logo to return home", async () => {
                                await homePage.logo.click();
                                await expect(page).toHaveURL(endpoints.home);
                                await homePage.servicesSection.scrollIntoViewIfNeeded();
                            });
                        } else {
                            // If there are no services, we are skipping the steps that follow
                            console.log(`Skipping steps for tab ${tabName}, because it is empty.`);
                        }
                    });
                }
            }
        );

        test(
            "C213 - Checking *Спецтехніка* section on the main page",
            async ({ page, homePage }) => {
                
                await test.step("1. Open home page and scroll to Special Equipment section", async () => {
                    await homePage.open();
                    await homePage.specialEquipmentSection.scrollIntoViewIfNeeded();
                    await expect(homePage.specialEquipmentTitle).toBeVisible();
                    await expect(homePage.specialEquipmentTitle).toHaveText(mainPageConsts.specialEquipment.sectionTitle);
                });

                const tabsCount = await homePage.specialEquipmentTabs.count();

                for (let i = 0; i < tabsCount; i++) {
                    const currentTab = homePage.specialEquipmentTabs.nth(i);
                    const tabName = await currentTab.innerText();

                    await test.step(`Tab: «${tabName}»`, async () => {
                        await currentTab.click();
                        
                        const itemsCount = await homePage.specialEquipmentItems.count();

                        expect.soft(itemsCount, `Category «${tabName}» is empty!`).toBeGreaterThan(0);

                        if (itemsCount > 0) {
                            await test.step("--- Click on the first equipment category", async () => {
                                await homePage.specialEquipmentItems.first().click();
                                await expect(page).toHaveURL(/.*products.*/); 
                            });

                            await test.step("--- [SKIPPED] Click on the first relevant unit", async () => {
                                markStepAsSkipped("Selection of a relevant unit", "The website currently has no units.");
                            });

                            await test.step("--- Click on the logo to return home", async () => {
                                await homePage.logo.click();
                                await expect(page).toHaveURL(endpoints.home);
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