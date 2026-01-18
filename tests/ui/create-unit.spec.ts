import { expect, test } from "../../fixtures/fixtures";
import createUnitConsts from "../../constants/create-unit.constants.json";
import endpoints from "../../constants/endpoints.constants.json";
import { MainInfoComponent } from "../../components/create-unit/1/main-info.component";
import { isDesktop } from "../../utils/viewportGuard";
import { markStepAsSkipped } from "../../utils/skipTest";

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
                            createUnitConsts["page title"],
                        );
                    });
                });

                await test.step(`The first tab: ⤵️`, async () => {
                    const { number: tabNumber, title: tabTitle } =
                        await createUnitPage.getTabMetaInfo("1");

                    await test.step(`• is selected;`, async () => {
                        expect(createUnitPage.tabList.first()).toHaveAttribute(
                            "aria-selected",
                            "true",
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
                        createUnitConsts.tabs,
                    ).map((tab) => tab.title);

                    await test.step("• are not active;", async () => {
                        for (
                            let i = 1;
                            i < createUnitPage.tabNumbers.length;
                            i++
                        ) {
                            expect(
                                createUnitPage.tabList.nth(i),
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
            },
        );

        test.only(
            "Verify category (Категорія) section",
            {
                tag: "@UI",
                annotation: [{ type: "Test case", description: "C296" }],
            },
            async ({ createUnitPage, page }) => {
                const mainInfoComponent = new MainInfoComponent(page);

                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${createUnitConsts["tabs"]["1"]["category"]["label"]}» text;`, async () => {
                        await expect(mainInfoComponent.label).toContainText(
                            createUnitConsts["tabs"]["1"]["category"]["label"],
                        );
                    });

                    await test.step("• is visible;", async () => {
                        await expect(mainInfoComponent.label).toBeVisible();
                    });

                    await test.step("• has an asterisk.", async () => {
                        await expect(
                            mainInfoComponent.requiredSymbol,
                        ).toBeVisible();
                    });
                });

                await test.step("The input field: ⤵️", async () => {
                    await test.step(`• has the «${createUnitConsts["tabs"]["1"]["category"]["placeholder"]}» background text;`, async () => {
                        await expect(
                            mainInfoComponent.fieldPlaceholder,
                        ).toHaveText(
                            createUnitConsts["tabs"]["1"]["category"][
                                "placeholder"
                            ],
                        );
                    });

                    await test.step("• to contain arrow in the right side of field. ", async () => {
                        await expect(
                            mainInfoComponent.fieldArrow,
                        ).toBeVisible();
                    });

                    await test.step("• requires filling.", async () => {
                        await createUnitPage.clickNextButton();

                        await expect(mainInfoComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${mainInfoComponent.borderColor}`,
                        );

                        await expect(
                            mainInfoComponent.errorBlock,
                        ).toBeVisible();

                        await expect(mainInfoComponent.errorBlock).toHaveText(
                            createUnitConsts["error message"],
                        );
                    });
                });

                await test.step("The category popup: ⤵️", async () => {
                    await test.step("• opens when the field is clicked;", async () => {
                        mainInfoComponent.clickCategorySelect();
                        await expect(
                            mainInfoComponent.categoryPopup,
                        ).toBeVisible();
                    });

                    await test.step(`• has the «${
                        isDesktop(page)
                            ? createUnitConsts["tabs"]["1"]["category"][
                                  "popup title"
                              ]
                            : createUnitConsts["tabs"]["1"]["category"][
                                  "mobile popup title"
                              ]
                    }» title;`, async () => {
                        await expect(mainInfoComponent.popupTitle).toHaveText(
                            isDesktop(page)
                                ? createUnitConsts["tabs"]["1"]["category"][
                                      "popup title"
                                  ]
                                : createUnitConsts["tabs"]["1"]["category"][
                                      "mobile popup title"
                                  ],
                        );
                    });

                    await test.step("• has the Close button;", async () => {
                        await expect(
                            mainInfoComponent.popupCloseBtn,
                        ).toBeVisible();
                    });

                    await test.step("• disappears when the Close button is clicked;", async () => {
                        await mainInfoComponent.clickCloseBtn();
                        await expect(
                            mainInfoComponent.categoryPopup,
                        ).toBeHidden();
                    });

                    await test.step("• disappears when clicking outside of it.", async () => {
                        if (!isDesktop(page)) {
                            markStepAsSkipped("Clicking outside of modal");
                            return;
                        }
                        await mainInfoComponent.clickCategorySelect();
                        await mainInfoComponent.clickPopupOutside();
                        await expect(
                            mainInfoComponent.categoryPopup,
                        ).toBeHidden();
                    });
                });
            },
        );
    },
);
