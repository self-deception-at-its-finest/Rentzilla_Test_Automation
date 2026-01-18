import { expect, test } from "../../fixtures/fixtures";
import createUnitConstsJSON from "../../constants/create-unit/create-unit.constants.json";
import { createUnitConstsTS } from "../../constants/create-unit/create-unit.constants";
import endpoints from "../../constants/endpoints.constants.json";
import catalogConstsJSON from "../../constants/catalog.constants.json";
import { isDesktop } from "../../utils/viewport-guard";
import { markStepAsSkipped } from "../../utils/skip-test";
import { CategoryComponent } from "../../components/create-unit/1/category.component";
import { AdComponent } from "../../components/create-unit/1/ad.component";
import { fieldPlaceholder } from "../../utils/form-helper";

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
                annotation: { type: "Test case", description: "C294" },
            },
            async ({ createUnitPage }) => {
                await test.step("The page title is: ⤵️", async () => {
                    await test.step("• visible", async () => {
                        await expect(createUnitPage.pageTitle).toBeVisible();
                    });
                    await test.step("• correct", async () => {
                        await expect(createUnitPage.pageTitle).toHaveText(
                            createUnitConstsJSON["page title"],
                        );
                    });
                });

                await test.step(`The first tab: ⤵️`, async () => {
                    const { number: tabNumber, title: tabTitle } =
                        await createUnitPage.getTabMetaInfo("1");

                    await test.step(`• is selected`, async () => {
                        expect(createUnitPage.tabList.first()).toHaveAttribute(
                            "aria-selected",
                            "true",
                        );
                    });

                    await test.step(`• has the “${tabTitle}” title`, async () => {
                        expect(tabTitle).toEqual(tabTitle);
                    });

                    await test.step(`• has the “${tabNumber}” number.`, async () => {
                        expect(tabNumber).toEqual("1");
                    });
                });

                await test.step("Other tabs: ⤵️", async () => {
                    const tabTitlesFromJSON = Object.values(
                        createUnitConstsJSON.tabs,
                    ).map((tab) => tab.title);

                    await test.step("• are not active", async () => {
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

        test(
            "Verify category (Категорія) section",
            {
                tag: "@UI",
                annotation: { type: "Test case", description: "C296" },
            },
            async ({ createUnitPage, page }) => {
                const categoryComponent = new CategoryComponent(page);

                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${createUnitConstsJSON["tabs"]["1"]["category"]["label"]}» text`, async () => {
                        await expect(categoryComponent.label).toContainText(
                            createUnitConstsJSON["tabs"]["1"]["category"][
                                "label"
                            ],
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(categoryComponent.label).toBeVisible();
                    });

                    await test.step("• has an asterisk.", async () => {
                        await expect(
                            categoryComponent.requiredSymbol,
                        ).toBeVisible();
                    });
                });

                await test.step("The input field: ⤵️", async () => {
                    await test.step(`• has the «${createUnitConstsJSON["tabs"]["1"]["category"]["placeholder"]}» background text`, async () => {
                        await expect(
                            categoryComponent.fieldPlaceholder,
                        ).toHaveText(
                            createUnitConstsJSON["tabs"]["1"]["category"][
                                "placeholder"
                            ],
                        );
                    });

                    await test.step("• to contain arrow in the right side of field. ", async () => {
                        await expect(
                            categoryComponent.fieldArrow,
                        ).toBeVisible();
                    });

                    await test.step("• requires filling.", async () => {
                        await createUnitPage.clickNextButton();

                        await expect(categoryComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${createUnitConstsTS.errorBorderColor}`,
                        );

                        await expect(
                            categoryComponent.errorBlock,
                        ).toBeVisible();

                        await expect(categoryComponent.errorBlock).toHaveText(
                            createUnitConstsJSON["error messages"]["empty"],
                        );
                    });
                });

                await test.step("The category popup: ⤵️", async () => {
                    await test.step("• opens when the field is clicked", async () => {
                        categoryComponent.clickCategorySelect();
                        await expect(categoryComponent.popup).toBeVisible();
                    });

                    await test.step(`• has the «${
                        isDesktop(page)
                            ? createUnitConstsJSON["tabs"]["1"]["category"][
                                  "popup title"
                              ]
                            : createUnitConstsJSON["tabs"]["1"]["category"][
                                  "mobile popup title"
                              ]
                    }» title`, async () => {
                        await expect(categoryComponent.popupTitle).toHaveText(
                            isDesktop(page)
                                ? createUnitConstsJSON["tabs"]["1"]["category"][
                                      "popup title"
                                  ]
                                : createUnitConstsJSON["tabs"]["1"]["category"][
                                      "mobile popup title"
                                  ],
                        );
                    });

                    await test.step("• has the Close button", async () => {
                        await expect(
                            categoryComponent.popupCloseBtn,
                        ).toBeVisible();
                    });

                    await test.step("• disappears when the Close button is clicked", async () => {
                        await categoryComponent.clickCloseBtn();
                        await expect(categoryComponent.popup).toBeHidden();
                    });

                    await test.step("• disappears when clicking outside of it", async () => {
                        if (!isDesktop(page)) {
                            markStepAsSkipped("Clicking outside of modal");
                            return;
                        }
                        await categoryComponent.clickCategorySelect();
                        await categoryComponent.clickPopupOutside();
                        await expect(categoryComponent.popup).toBeHidden();
                    });

                    await test.step("• disappears when chosing the particular category, and the field is filled correctly", async () => {
                        if (await categoryComponent.popup.isHidden()) {
                            await categoryComponent.clickCategorySelect();
                        }

                        await categoryComponent.selectFirstCategory();
                        await expect(
                            categoryComponent.secondCategoryList,
                        ).toBeVisible();

                        await categoryComponent.selectSecondCategory();
                        await expect(
                            categoryComponent.thirdCategoryList,
                        ).toBeVisible();

                        await categoryComponent.selectThirdCategory();
                        await expect(categoryComponent.popup).toBeHidden();

                        const pileDrivingTitle =
                            catalogConstsJSON["special equipment"].categories[
                                "building equipment"
                            ].subcategories["drilling rigs"].subcategories[
                                "pile-driving rigs"
                            ].title;
                        await expect(
                            categoryComponent.fieldPlaceholder,
                        ).toHaveText(new RegExp(`^${pileDrivingTitle}$`, "i"));
                    });
                });
            },
        );

        test(
            "Verify unit name section",
            {
                tag: ["@UI"],
                annotation: {
                    type: "Test case",
                    description: "C297",
                },
            },
            async ({ createUnitPage, page }) => {
                const adComponent = new AdComponent(page);
                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${createUnitConstsJSON["tabs"]["1"]["ad"]["label"]}» text`, async () => {
                        await expect(adComponent.label).toContainText(
                            createUnitConstsJSON["tabs"]["1"]["ad"]["label"],
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(adComponent.label).toBeVisible();
                    });

                    await test.step("• has an asterisk", async () => {
                        await expect(adComponent.requiredSymbol).toBeVisible();
                    });
                });

                await test.step("The input field: ⤵️", async () => {
                    const placeholder =
                        createUnitConstsJSON["tabs"]["1"]["ad"]["placeholder"];
                    const emptyErrMsg =
                        createUnitConstsJSON["error messages"]["empty"];

                    await test.step(`• has the «${placeholder}» background text`, async () => {
                        expect(
                            await fieldPlaceholder(adComponent.field),
                        ).toEqual(placeholder);
                    });

                    await test.step("• requires filling", async () => {
                        await createUnitPage.clickNextButton();

                        await expect(adComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${createUnitConstsTS.errorBorderColor}`,
                        );

                        await expect(adComponent.errorBlock).toBeVisible();

                        await expect(adComponent.errorBlock).toHaveText(
                            emptyErrMsg,
                        );
                    });
                });

                await test.step("Validate field requirements: ⤵️", async () => {
                    const less10 = "123456789"; // less than 10 symbols string
                    const more100 = // more than 100 symbols string
                        "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor. Vivamus ultricies esa";
                    const forbiddenSymbols =
                        createUnitConstsJSON["tabs"]["1"]["ad"][
                            "forbiddenSymbols"
                        ];

                    const fewErrMsg =
                        createUnitConstsJSON["error messages"]["too few"];
                    const fullErrMsg =
                        createUnitConstsJSON["error messages"]["full"];

                    await test.step("• string cannot be less than 10 symbols", async () => {
                        await adComponent.typeIntoField(less10);
                        await createUnitPage.clickNextButton();

                        await expect(adComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${createUnitConstsTS.errorBorderColor}`,
                        );
                        await expect(adComponent.errorBlock).toBeVisible();
                        await expect(adComponent.errorBlock).toHaveText(
                            fewErrMsg,
                        );
                        await adComponent.clearTheField();
                    });

                    await test.step("• string cannot be more than 100 symbols", async () => {
                        await adComponent.typeIntoField(more100);
                        await createUnitPage.clickNextButton();

                        await expect(adComponent.field).toHaveText("");
                        await expect(adComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${createUnitConstsTS.errorBorderColor}`,
                        );
                        await expect(adComponent.errorBlock).toBeVisible();
                        await expect(adComponent.errorBlock).toHaveText(
                            fullErrMsg,
                        );
                        await adComponent.clearTheField();
                    });

                    await test.step("• string cannot have these symbols: <>{};^", async () => {
                        await adComponent.typeIntoField(forbiddenSymbols);
                        await expect(adComponent.field).toHaveValue("");
                    });

                    await test.step("• string can contain from 10 to 100 symbols", async () => {
                        const validStr = less10 + less10;

                        await adComponent.typeIntoField(validStr);
                        await expect(adComponent.field).toHaveValue(validStr);
                        await expect(adComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${createUnitConstsTS.defaultBorderColor}`,
                        );
                        await expect(adComponent.errorBlock).toBeHidden();
                    });
                });
            },
        );
    },
);
