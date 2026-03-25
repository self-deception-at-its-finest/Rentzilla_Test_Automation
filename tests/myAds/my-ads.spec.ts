import { expect, test } from "../../fixtures/indexV2";
import { MY_ADS_CONSTS } from "../../constants/my-ads/myAds.constansts";
import { ENDPOINTS } from "../../constants/endpoints.constants";
import { extractAllTitles } from "../../utils/subCategories";
import { SPECIAL_EQUIPMENT } from "../../constants/catalog.constants";
import { generateNonExistentName } from "@utils/getRandomName";
import { sortUnitNames } from "@utils/sortUnitNames";

test.describe("My Ads User2", () => {

  test("The 'Мої оголошення' page without any created units.", // Precondition: the user has no created ads
    {
      tag: "@UI",
      annotation: { type: "Test case", description: "C321" },
    },
    async ({ authorizedUser2HomePage, myAdsUser2Page, user2Page: page }) => {

      await test.step("Navigate to 'Мої оголошення'", async () => {
        await authorizedUser2HomePage.navigateToMyAds();
      });

      await test.step("1. The message is displayed on the screen", async () => {
        await expect(myAdsUser2Page.emptyTitle).toBeVisible();
        await expect(myAdsUser2Page.emptyTitle).toHaveText(MY_ADS_CONSTS.EMPTY_STATE.TITLE);
      });

      await test.step("2. After click on the 'Подати оголошення' button the user is redirected to the 'Створення оголошення' page", async () => {
        await expect(myAdsUser2Page.createUnitButton).toBeVisible();
        await expect(myAdsUser2Page.createUnitButton).toHaveText(MY_ADS_CONSTS.EMPTY_STATE.CREATE_UNIT_BTN);
        await myAdsUser2Page.createUnitButton.click();
        await expect(page).toHaveURL(ENDPOINTS.CREATE_UNIT);
      });
    });

});

test.describe("My Ads Standard User", () => {

  test.beforeEach(async ({ authorizedHomePage }) => {
    await test.step("Navigate to 'Мої оголошення'", async () => {
      await authorizedHomePage.navigateToMyAds();
    });
  });

  test("Verify that the tabs are clickable",
    {
      tag: "@UI",
      annotation: { type: "Test case", description: "C322" },
    },
    async ({ myAdsPage }) => { 

      const tabData = [
        { name: MY_ADS_CONSTS.TABS.ACTIVE, emptyMsg: MY_ADS_CONSTS.EMPTY_TITLES.ACTIVE },
        { name: MY_ADS_CONSTS.TABS.DEACTIVATED, emptyMsg: MY_ADS_CONSTS.EMPTY_TITLES.DEACTIVATED },
        { name: MY_ADS_CONSTS.TABS.PENDING, emptyMsg: MY_ADS_CONSTS.EMPTY_TITLES.PENDING },
        { name: MY_ADS_CONSTS.TABS.REJECTED, emptyMsg: MY_ADS_CONSTS.EMPTY_TITLES.REJECTED },
      ];

      let i = 1;
      for (const tab of tabData) {
        await test.step(i + `. Click on the "${tab.name}" tab and verify content`, async () => {
          const currentTab = myAdsPage.getTab(tab.name);
          await currentTab.click();
          // Check that the clicked tab is active
          await expect(currentTab).toHaveAttribute('aria-selected', 'true');
          // Verify content: either unit cards or a message about the empty list
          if (await myAdsPage.isCardsVisible()) {
            await expect(myAdsPage.unitCards.first()).toBeVisible();
          } else {
            await expect(myAdsPage.emptyTitle).toHaveText(tab.emptyMsg);
            console.log(`Tab "${tab.name}" is empty, verified empty state message.`);
          }
          i++;
        });
      }
    });

  const tabs = [
    MY_ADS_CONSTS.TABS.ACTIVE,  // 'Активні'
    MY_ADS_CONSTS.TABS.DEACTIVATED, // 'Деактивовані'
    MY_ADS_CONSTS.TABS.PENDING, // 'Очікуючі'
    MY_ADS_CONSTS.TABS.REJECTED  // 'Відхилені'
  ];

  const categoriesToCheck = [
    MY_ADS_CONSTS.CATEGORIES.BUILDING_EQUIPMENT, // 'Будівельне обладнання'
    MY_ADS_CONSTS.CATEGORIES.COMMUNAL_EQUIPMENT, // 'Комунальне обладнання'
    MY_ADS_CONSTS.CATEGORIES.WAREHOUSE_EQUIPMENT // 'Складське обладнання'
  ];

  const subcategoryMap = {
    [MY_ADS_CONSTS.CATEGORIES.BUILDING_EQUIPMENT]: extractAllTitles(SPECIAL_EQUIPMENT.categories["building equipment"]),
    [MY_ADS_CONSTS.CATEGORIES.COMMUNAL_EQUIPMENT]: extractAllTitles(SPECIAL_EQUIPMENT.categories["municipal equipment"]),
    [MY_ADS_CONSTS.CATEGORIES.WAREHOUSE_EQUIPMENT]: extractAllTitles(SPECIAL_EQUIPMENT.categories["warehouse equipment"]),
  };

  test("Check filtering by category",
    {
      tag: "@functional",
      annotation: { type: "Test case", description: "C323" },
    },
    async ({ myAdsPage }) => {

      for (const category of categoriesToCheck) {
        await test.step(`Filter by category: ${category}`, async () => {
          await myAdsPage.selectCategory(category);

          // Walk through each tab with the filter already selected
          for (const tabName of tabs) {
            await test.step(`Verify category ${category} in tab ${tabName}`, async () => {
              await myAdsPage.switchTab(tabName);

              if (await myAdsPage.isCardsVisible()) {
                // The category text on the card should contain our category name
                await expect(myAdsPage.unitCategoryLabel.first()).toContainText(category);
                // Get the full text (for example "Складська техніка / Техніка для складування / Ножичні візки")
                const actualCategoryText = await myAdsPage.unitCategoryLabel.first().innerText();
                // Get the expected subcategories from our JSON
                const expectedSubs = subcategoryMap[category];
                const isMatch = expectedSubs.some((sub: string) => actualCategoryText.includes(sub));
                expect(isMatch,
                  `Text on the card: "${actualCategoryText}" does not contain any subcategories from JSON for "${category}". \nExpected: ${expectedSubs.join(', ')}`
                ).toBeTruthy();

              } else {
                // If empty — check the stable message
                await expect(myAdsPage.emptyTitle).toContainText(`в категорії "${category}" не знайдено`);
              }
            });
          }
        });
      }
    });

  test("Сheck sorting units",
    {
      tag: "@functional",
      annotation: { type: "Test case", description: "C324" },
    },
    async ({ myAdsPage, userPage: page }) => {

      const tabs = [
        MY_ADS_CONSTS.TABS.ACTIVE,
        MY_ADS_CONSTS.TABS.DEACTIVATED,
        MY_ADS_CONSTS.TABS.PENDING,
        MY_ADS_CONSTS.TABS.REJECTED
      ];

      for (const tabName of tabs) {
        await test.step(`Verify sorting in tab: ${tabName}`, async () => {
          await myAdsPage.switchTab(tabName);

          const isAtLeastTwoUnits = (await myAdsPage.unitCards.count()) >= 2;

          if (isAtLeastTwoUnits) {
            // --- Sort by name ---
            await test.step("1. Select 'По назві' sorting and verify alphabetical order", async () => {
              await myAdsPage.selectSortOption("По назві");
              await page.waitForTimeout(500);

              // The logic uses a regex to detect Latin characters and prioritize them at the top of the list.
              const names = await myAdsPage.unitNames.allInnerTexts();
              const sortedNames = sortUnitNames(names);

              expect(names, "Units should be sorted alphabetically (Latin first)").toEqual(sortedNames);
            });

            // --- Check sorting by date (newest first) ---
            // // NOTE: UI date is limited to DD.MM.YYYY. 
            // Automated ads created on the same day will have identical sort keys, 
            // which may lead to non-deterministic ordering or false-positive results in chronological sorting tests
            await test.step("2. Select 'По даті створення' sorting and verify chronological order", async () => {
              await myAdsPage.selectSortOption("По даті створення");
              await page.waitForTimeout(500);

              const dateStrings = await myAdsPage.unitDates.allInnerTexts();
              // Parse dates in DD.MM.YYYY format
              const dates = dateStrings.map((d) => {
                const [day, month, year] = d.split(".").map(Number);
                return new Date(year, month - 1, day).getTime();
              });

              for (let i = 0; i < dates.length - 1; i++) {
                expect(dates[i], `Date ${dateStrings[i]} should be >= ${dateStrings[i + 1]}`)
                  .toBeGreaterThanOrEqual(dates[i + 1]);
              }
            });
          } else {
            console.log(`Skip sorting check for ${tabName}: not enough units.`);
          }
        });
      }
    });

  test("Заголовок оголошення search field functionality",
    {
      tag: "@functional",
      annotation: { type: "Test case", description: "C325" },
    },
    async ({ myAdsPage }) => {

      let targetName: string;
      let allUnitNames: string[] = [];

      const tabs = [
        MY_ADS_CONSTS.TABS.ACTIVE,
        MY_ADS_CONSTS.TABS.DEACTIVATED,
        MY_ADS_CONSTS.TABS.PENDING,
        MY_ADS_CONSTS.TABS.REJECTED
      ];

      for (const tabName of tabs) {
        await test.step(`--- Вкладка: ${tabName} ---`, async () => {
          await myAdsPage.switchTab(tabName);

          await test.step("Check for at least 2 ads", async () => {
            await myAdsPage.unitCards.nth(1).waitFor({ state: 'visible' });
            allUnitNames = await myAdsPage.getVisibleUnitNames();
            expect(allUnitNames.length, 'The number of ads must be 2 or more').toBeGreaterThanOrEqual(2);
            targetName = allUnitNames[0];
          });

          await test.step("Dynamic search and deletion", async () => {
            // Type the target name letter by letter with a delay to simulate user input
            await myAdsPage.searchInput.pressSequentially(targetName, { delay: 100 });
            await expect(myAdsPage.unitCards).toContainText(targetName);

            // Delete the text sequentially
            await myAdsPage.deleteSearchTextSequentially();
            await expect(myAdsPage.searchInput).toHaveValue("");
          });

          await test.step("Case sensitivity check (Case-insensitive)", async () => {
            // Convert the target name to upper case
            const upperCaseName = targetName.toUpperCase();
            await myAdsPage.fieldActions.typeIntoField(myAdsPage.searchInput, upperCaseName);
            // Expect at least one result to be found, since the search should be case-insensitive
            const count = await myAdsPage.unitCards.count();
            expect(count, `The search should be case-insensitive: when searching for "${upperCaseName}", ${count} ads were found`).toBeGreaterThan(0);
            // Additionally, check that the visible card contain the target name
            await expect(myAdsPage.unitCards.first()).toContainText(targetName, { ignoreCase: true });
            await myAdsPage.clearSearch();
          });

          await test.step("Non-existent name and Reset filters", async () => {
            const fakeName = generateNonExistentName(allUnitNames);
            await myAdsPage.fieldActions.typeIntoField(myAdsPage.searchInput, fakeName);
            await expect(myAdsPage.emptyTitle).toHaveText(`Оголошення за назвою "${fakeName}" не знайдені`);

            await myAdsPage.resetFiltersBtn.click();
            await expect(myAdsPage.searchInput).toHaveValue("");
          });

          const scenarios = [
            { label: "Special characters", value: "<>{};^ ! @ # $ %" },
            { label: "Long string (>100)", value: "Jї5".repeat(40) },
            { label: "Only spaces", value: "    " }
          ];

          for (const scenario of scenarios) {
            await test.step(`Scenario: ${scenario.label}`, async () => { // 10
              await myAdsPage.clearSearch();

              await myAdsPage.fieldActions.typeIntoField(myAdsPage.searchInput, scenario.value);

              // If the scenario value is empty, we expect to see all units. For invalid inputs, we expect to see the empty state
              if (scenario.value === "") {
                await expect(myAdsPage.unitCards).toHaveCount(allUnitNames.length);
              } else {
                await expect(myAdsPage.emptyTitle).toBeVisible();
                await expect(myAdsPage.unitCards).toHaveCount(0);
              }

              await myAdsPage.resetFiltersBtn.click();
              await expect(myAdsPage.searchInput).toHaveValue("");
            });
          }

          if (tabName !== MY_ADS_CONSTS.TABS.ACTIVE && allUnitNames.length > 0) {
            const unitToVerify = allUnitNames[0];

            await test.step(`Verify unit from ${tabName} is NOT in Active tab`, async () => { // 11-12
              await myAdsPage.clearSearch();
              await myAdsPage.switchTab(MY_ADS_CONSTS.TABS.ACTIVE);

              const activeTabLocator = myAdsPage.getTab(MY_ADS_CONSTS.TABS.ACTIVE);
              await expect(activeTabLocator).toHaveAttribute('aria-selected', 'true');

              await myAdsPage.fieldActions.typeIntoField(myAdsPage.searchInput, unitToVerify);
              await expect(myAdsPage.emptyTitle).toBeVisible({});
              await myAdsPage.resetFiltersBtn.click();

              await myAdsPage.switchTab(tabName);
              const originalTabLocator = myAdsPage.getTab(tabName);
              await expect(originalTabLocator).toHaveAttribute('aria-selected', 'true');

              await myAdsPage.fieldActions.typeIntoField(myAdsPage.searchInput, unitToVerify);
              await expect(myAdsPage.unitCards.first()).toContainText(unitToVerify);

              await myAdsPage.clearSearch();
              await expect(myAdsPage.searchInput).toHaveValue("");
            });
          }

        });
      }
    });

});