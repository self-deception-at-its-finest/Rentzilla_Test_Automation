import { expect, test } from "../../fixtures/fixtures";
import createUnitConstants from "../../constants/create-unit.constants.json";
import endpoints from "../../constants/endpoints.constants.json";

test.describe(
    "“Create unit” page",
    {
        annotation: [
            { type: "Testing page", description: "«Створення оголошення»" },
            { type: "Path to page", description: endpoints["create unit"] },
        ],
    },
    () => {
        test(
            "Verify body title and tab titles",
            {
                tag: "@UI",
                annotation: [{ type: "Test case", description: "C294" }],
            },
            async ({ createUnitPage }) => {
                await test.step("The page title is: ⤵️", async () => {
                    await test.step("• visible", async () => {
                        await expect(createUnitPage.pageTitle).toBeVisible();
                    });
                    await test.step("• correct", async () => {
                        await expect(createUnitPage.pageTitle).toHaveText(
                            createUnitConstants["page title"]
                        );
                    });
                });

                await test.step(`The first tab: ⤵️`, async () => {
                    const { number: tabNumber, title: tabTitle } =
                        await createUnitPage.getTabMetaInfo("1");

                    await test.step(`• is selected;`, async () => {
                        expect(createUnitPage.tabList.first()).toHaveAttribute(
                            "aria-selected",
                            "true"
                        );
                    });
                    await test.step(`• has the “${tabTitle}” title;`, async () => {
                        expect(tabTitle).toEqual(tabTitle);
                    });
                    await test.step(`• has the “${tabNumber}” number.`, async () => {
                        expect(tabNumber).toEqual("1");
                    });
                });

                await test.step("Other tabs: ⤵️", async () => {
                    const tabTitlesFromJSON = Object.values(
                        createUnitConstants.tabs
                    ).map((tab) => tab.title);

                    await test.step("• are not active;", async () => {
                        for (
                            let i = 1;
                            i < createUnitPage.tabNumbers.length;
                            i++
                        ) {
                            expect(
                                createUnitPage.tabList.nth(i)
                            ).toHaveAttribute("aria-selected", "false");
                        }
                    });

                    await test.step(`• have these titles: ${tabTitlesFromJSON
                        .map((title) => `«${title}»`)
                        .join(", ")}`, async () => {
                        for (
                            let i = 1;
                            i < createUnitPage.tabNumbers.length;
                            i++
                        ) {
                            const tabKey = createUnitPage.tabNumbers[i];
                            const { title: tabTitle } =
                                await createUnitPage.getTabMetaInfo(tabKey);

                            expect(tabTitle).toEqual(tabTitlesFromJSON[i]);
                        }
                    });

                    await test.step("• have correct numbers.", async () => {
                        for (
                            let i = 1;
                            i < createUnitPage.tabNumbers.length;
                            i++
                        ) {
                            const tabKey = createUnitPage.tabNumbers[i];
                            const { number: tabNumber } =
                                await createUnitPage.getTabMetaInfo(tabKey);

                            expect(tabNumber).toEqual(tabKey);
                        }
                    });
                });
            }
        );
    }
);
