import { expect, test } from "../../fixtures/index";
import {
    BUTTONS,
    FORBIDDEN_SYMBOLS,
    MANUFACTURERS,
    TAB_NUMBERS,
    TAB_TITLES,
} from "../../constants/create-unit/createUnit.constants";
import {
    CREATE_UNIT_CONSTS,
    FIELDS_ERRORS,
} from "../../constants/create-unit/createUnit.constants";
import endpoints from "../../constants/endpoints.constants.json";
import catalog from "../../constants/catalog.constants.json";
import { isDesktop } from "../../utils/viewportGuard";
import { markStepAsSkipped } from "../../utils/skipTest";
import { getFieldPlaceholder } from "../../utils/formHelper";
import {
    DEFAULT_LOCATION,
    tabsFields,
} from "../../constants/create-unit/fields.constants";
import { generateText, generateValidText } from "../../utils/fakeData";
import { formatMissingManufacturerError } from "../../utils/formatErrorMessages";
import { getRandomStringElement } from "../../utils/getElements";
import {
    expectFieldDefault,
    expectFieldError,
    expectTabActive,
    expectTabInactive,
} from "../../utils/uiMatchers";
import { clickOutside } from "../../utils/closeModal";

test.describe(
    "“Create unit” page | The “Main info” tab",
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
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C294" },
            },
            async ({ createUnitPage }) => {
                await test.step("The page title is: ⤵️", async () => {
                    await test.step("• visible", async () => {
                        await expect(createUnitPage.pageTitle).toBeVisible();
                    });
                    await test.step("• correct", async () => {
                        await expect(createUnitPage.pageTitle).toHaveText(
                            CREATE_UNIT_CONSTS.PAGE_TITLE,
                        );
                    });
                });

                await test.step(`The first tab: ⤵️`, async () => {
                    await test.step(`• is selected`, async () => {
                        await expectTabActive(createUnitPage.tabList.first());
                    });

                    await test.step(`• has the “${CREATE_UNIT_CONSTS.PAGE_TITLE}” title`, async () => {
                        expect(createUnitPage.pageTitle).toHaveText(
                            CREATE_UNIT_CONSTS.PAGE_TITLE,
                        );
                    });

                    await test.step(`• has the “${TAB_NUMBERS[0]}” number.`, async () => {
                        expect(createUnitPage.tabList.first()).toContainText(
                            TAB_NUMBERS[0],
                        );
                    });
                });

                await test.step("Other tabs: ⤵️", async () => {
                    await test.step("• are not active", async () => {
                        for (let i = 1; i < TAB_NUMBERS.length; i++) {
                            await expectTabInactive(
                                createUnitPage.tabList.nth(i),
                            );
                        }
                    });

                    await test.step(`• have these titles: ${TAB_TITLES.map(
                        (title) => `«${title}»`,
                    ).join(", ")}`, async () => {
                        for (let i = 1; i < TAB_NUMBERS.length; i++) {
                            const { title: tabTitle } =
                                await createUnitPage.getTabMetaInfo(
                                    TAB_NUMBERS[i],
                                );

                            expect(tabTitle).toEqual(TAB_TITLES[i]);
                        }
                    });

                    await test.step("• have correct numbers.", async () => {
                        for (let i = 1; i < TAB_NUMBERS.length; i++) {
                            const tabKey = TAB_NUMBERS[i];
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
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C296" },
            },
            async ({ createUnitPage, categoryComponent, page }) => {
                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${tabsFields.category.label}» text`, async () => {
                        await expect(categoryComponent.label).toContainText(
                            tabsFields.category.label,
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(categoryComponent.label).toBeVisible();
                    });

                    await test.step("• has an asterisk.", async () => {
                        await expect(
                            categoryComponent.requiredSymbol!,
                        ).toBeVisible();
                    });
                });

                await test.step("The input field: ⤵️", async () => {
                    await test.step(`• has the «${tabsFields.category.placeholder}» background text`, async () => {
                        await expect(
                            categoryComponent.fieldPlaceholder,
                        ).toHaveText(tabsFields.category.placeholder);
                    });

                    await test.step("• to contain arrow in the right side of field. ", async () => {
                        await expect(
                            categoryComponent.fieldArrow,
                        ).toBeVisible();
                    });

                    await test.step("• requires filling.", async () => {
                        await createUnitPage.nextStep();
                        await expectFieldError(categoryComponent.field);

                        await expect(
                            categoryComponent.errorBlock,
                        ).toBeVisible();

                        await expect(categoryComponent.errorBlock).toHaveText(
                            FIELDS_ERRORS.EMPTY,
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
                            ? tabsFields.category.popupTitle
                            : tabsFields.category.mobPopupTitle
                    }» title`, async () => {
                        await expect(categoryComponent.popupTitle).toHaveText(
                            isDesktop(page)
                                ? tabsFields.category.popupTitle
                                : tabsFields.category.mobPopupTitle,
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
                        await clickOutside(page);
                        await expect(categoryComponent.popup).toBeHidden();
                    });

                    await test.step("• disappears when chosing the particular category, and the field is filled correctly", async () => {
                        if (await categoryComponent.popup.isHidden())
                            await categoryComponent.clickCategorySelect();

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

                        // Get the last unit title
                        const pileDrivingTitle =
                            catalog["special equipment"].categories[
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
            async ({ createUnitPage, adComponent }) => {
                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${tabsFields.ad.label}» text`, async () => {
                        await expect(adComponent.label).toContainText(
                            tabsFields.ad.label,
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(adComponent.label).toBeVisible();
                    });

                    await test.step("• has an asterisk", async () => {
                        await expect(adComponent.requiredSymbol!).toBeVisible();
                    });
                });

                await test.step("The input field: ⤵️", async () => {
                    await test.step(`• has the «${tabsFields.ad.placeholder}» background text`, async () => {
                        expect(
                            await getFieldPlaceholder(adComponent.field),
                        ).toEqual(tabsFields.ad.placeholder);
                    });

                    await test.step("• requires filling", async () => {
                        await createUnitPage.nextStep();

                        await expectFieldError(adComponent.field);

                        await expect(adComponent.errorBlock).toBeVisible();

                        await expect(adComponent.errorBlock).toHaveText(
                            FIELDS_ERRORS.EMPTY,
                        );
                    });
                });

                await test.step("Validate field requirements: ⤵️", async () => {
                    const less10 = generateText(9);
                    const validText = generateValidText();
                    const more100 = generateText(101);

                    await test.step("• string cannot be less than 10 symbols", async () => {
                        await adComponent.typeAd(less10);
                        await createUnitPage.nextStep();

                        await expectFieldError(adComponent.field);
                        await expect(adComponent.errorBlock).toBeVisible();
                        await expect(adComponent.errorBlock).toHaveText(
                            FIELDS_ERRORS.LESS_10_SYMBOLS,
                        );
                        await adComponent.clearAdField();
                    });

                    await test.step("• string cannot be more than 100 symbols", async () => {
                        await adComponent.typeAd(more100);
                        await createUnitPage.nextStep();

                        await expect(adComponent.field).toHaveText("");
                        await expectFieldError(adComponent.field);
                        await expect(adComponent.errorBlock).toBeVisible();
                        await expect(adComponent.errorBlock).toHaveText(
                            FIELDS_ERRORS.MORE_100_SYMBOLS,
                        );
                        await adComponent.clearAdField();
                    });

                    await test.step(`• string cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
                        await adComponent.typeAd(FORBIDDEN_SYMBOLS);
                        await expect(adComponent.field).toHaveValue("");
                    });

                    await test.step("• string can contain from 10 to 100 symbols", async () => {
                        await adComponent.typeAd(validText);
                        await expect(adComponent.field).toHaveValue(validText);
                        await expectFieldDefault(adComponent.field);
                        await expect(adComponent.errorBlock).toBeHidden();
                    });
                });
            },
        );

        test(
            "Verify vehicle manufacturer section",
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C298" },
            },
            async ({ createUnitPage, manufacturerComponent }) => {
                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${tabsFields.manufacturer.label}» text`, async () => {
                        await expect(manufacturerComponent.label).toContainText(
                            tabsFields.manufacturer.label,
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(manufacturerComponent.label).toBeVisible();
                    });

                    await test.step("• has an asterisk", async () => {
                        await expect(
                            manufacturerComponent.requiredSymbol!,
                        ).toBeVisible();
                    });
                });

                await test.step("The input field: ⤵️", async () => {
                    await test.step(`• has the «${tabsFields.manufacturer.placeholder}» background text`, async () => {
                        expect(
                            await getFieldPlaceholder(
                                manufacturerComponent.field,
                            ),
                        ).toEqual(tabsFields.manufacturer.placeholder);
                    });

                    await test.step("• requires filling", async () => {
                        await createUnitPage.nextStep();

                        await expectFieldError(
                            manufacturerComponent.fieldWrapper,
                        );

                        await expect(
                            manufacturerComponent.errorBlock,
                        ).toBeVisible();

                        await expect(
                            manufacturerComponent.errorBlock,
                        ).toHaveText(FIELDS_ERRORS.EMPTY);
                    });

                    await test.step("• shows the correct message about missing manufacturer", async () => {
                        await manufacturerComponent.clearManufacturerField();
                        let fakeManufacturer = "123456789";
                        await manufacturerComponent.typeManufacturer(
                            fakeManufacturer,
                        );
                        await expect(
                            manufacturerComponent.missingResults,
                        ).toHaveText(
                            formatMissingManufacturerError(fakeManufacturer),
                        );
                    });
                });

                await test.step("Dropdown list is displayed correct", async () => {
                    await manufacturerComponent.clearManufacturerField();
                    await manufacturerComponent.typeManufacturer("А");
                    await expect(
                        manufacturerComponent.firstResult,
                    ).toBeVisible();

                    await manufacturerComponent.typeManufacturer("тэк");
                    let fieldValue =
                        await manufacturerComponent.field.getAttribute("value");
                    let result =
                        await manufacturerComponent.firstResult.textContent();

                    expect(fieldValue?.toUpperCase()).toEqual(result);

                    await manufacturerComponent.clearManufacturerField();
                    await manufacturerComponent.typeManufacturer("АТЭК");
                    let result2 =
                        await manufacturerComponent.firstResult.textContent();

                    expect(fieldValue?.toUpperCase()).toEqual(result2);
                    expect(result).toEqual(result2);
                });

                await test.step("Validate field requirements: ⤵️", async () => {
                    await test.step("• string cannot be more than 100 symbols", async () => {
                        let more100 = generateText(101);

                        await manufacturerComponent.clearManufacturerField();
                        await manufacturerComponent.typeManufacturer(more100);

                        await expect(
                            manufacturerComponent.field,
                        ).not.toHaveValue(more100);
                        await manufacturerComponent.clearManufacturerField();
                    });

                    await test.step(`• string cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
                        await manufacturerComponent.clearManufacturerField();
                        await manufacturerComponent.typeManufacturer(
                            FORBIDDEN_SYMBOLS,
                        );
                        await expect(manufacturerComponent.field).toHaveValue(
                            "",
                        );
                    });

                    await test.step("• accept the correct manufacturer", async () => {
                        let validManufacturer =
                            getRandomStringElement(MANUFACTURERS).toLowerCase();

                        await manufacturerComponent.clearManufacturerField();
                        await manufacturerComponent.setManufacturer(
                            validManufacturer,
                        );
                        await expect(
                            manufacturerComponent.chosenManufacturer,
                        ).toHaveText(validManufacturer, { ignoreCase: true });
                    });

                    await test.step("• is cleared by the cross button", async () => {
                        await manufacturerComponent.clearManufacturerField();
                        await expect(manufacturerComponent.field).toHaveValue(
                            "",
                        );
                    });
                });
            },
        );

        test(
            "Verify model name input field",
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C299" },
            },
            async ({ createUnitPage: _, modelComponent }) => {
                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${tabsFields.model.label}» text`, async () => {
                        await expect(modelComponent.label).toContainText(
                            tabsFields.model.label,
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(modelComponent.label).toBeVisible();
                    });
                });

                await test.step(`The field has the «${tabsFields.model.placeholder}» background text`, async () => {
                    expect(
                        await getFieldPlaceholder(modelComponent.field),
                    ).toEqual(tabsFields.model.placeholder);
                });

                await test.step("Validate field requirements: ⤵️", async () => {
                    await modelComponent.clearModelField();

                    await test.step("• string cannot be more than 15 symbols", async () => {
                        let texts = [
                            generateText(16),
                            generateText(7) + " " + generateText(8),
                            generateText(15) + " ",
                        ];
                        for (const text of texts) {
                            await modelComponent.typeModel(text);

                            await expect(modelComponent.errorBlock).toHaveText(
                                FIELDS_ERRORS.MORE_15_SYMBOLS,
                            );

                            await expectFieldError(modelComponent.field);

                            await modelComponent.clearModelField();
                        }
                    });

                    await test.step(`• string cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
                        await modelComponent.typeModel(FORBIDDEN_SYMBOLS);
                        await expect(modelComponent.field).toHaveValue("");
                    });

                    await test.step("• string accept 15 or less symbols", async () => {
                        let text = generateText(15);
                        await modelComponent.typeModel(text);
                        await expectFieldDefault(modelComponent.field);
                    });
                });
            },
        );

        test(
            "Verify technical specifications section",
            {
                tag: "@field validation",
                annotation: { type: "Test case", description: "C317" },
            },
            async ({ createUnitPage: _, specificationsComponent }) => {
                await test.step("The Title: ⤵️", async () => {
                    await test.step(`• has the ${tabsFields.specifications.label} text`, async () => {
                        await expect(specificationsComponent.label).toHaveText(
                            tabsFields.specifications.label,
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(
                            specificationsComponent.label,
                        ).toBeVisible();
                    });
                });

                await test.step("Field is enabled and not “readonly”", async () => {
                    await expect(specificationsComponent.field).toBeEnabled();
                    await expect(
                        specificationsComponent.field,
                    ).not.toHaveAttribute("readonly", "");
                });

                await test.step("Field is clear", async () => {
                    await expect(specificationsComponent.field).toHaveValue("");
                });

                await test.step("Field validation: ⤵️", async () => {
                    await test.step(`• text cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
                        await specificationsComponent.typeSpecifications(
                            FORBIDDEN_SYMBOLS,
                        );

                        await expect(specificationsComponent.field).toHaveValue(
                            "",
                        );
                        await specificationsComponent.fillSpecifications(
                            FORBIDDEN_SYMBOLS,
                        );
                        await expect(specificationsComponent.field).toHaveValue(
                            "",
                        );
                    });

                    await test.step("• text cannot have more than 9000 symbols", async () => {
                        const largeText = generateText(9000);
                        await specificationsComponent.fillSpecifications(
                            largeText,
                        );
                        await specificationsComponent.typeSpecifications("1");
                        await expect(specificationsComponent.field).toHaveValue(
                            largeText,
                        );
                    });
                });
            },
        );

        test(
            "Verify description section",
            {
                tag: "@field validation",
                annotation: { type: "Test case", description: "C318" },
            },
            async ({ createUnitPage: _, detailsComponent }) => {
                await test.step("The Title: ⤵️", async () => {
                    await test.step(`• has the ${tabsFields.details.label} text`, async () => {
                        await expect(detailsComponent.label).toHaveText(
                            tabsFields.details.label,
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(detailsComponent.label).toBeVisible();
                    });
                });

                await test.step("Field is enabled and not “readonly”", async () => {
                    await expect(detailsComponent.field).toBeEnabled();
                    await expect(detailsComponent.field).not.toHaveAttribute(
                        "readonly",
                        "",
                    );
                });

                await test.step("Field is clear", async () => {
                    await expect(detailsComponent.field).toHaveValue("");
                });
                await test.step("Field validation: ⤵️", async () => {
                    await test.step(`• text cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
                        await detailsComponent.typeDetails(FORBIDDEN_SYMBOLS);
                        await expect(detailsComponent.field).toHaveValue("");
                        await detailsComponent.fillDetails(FORBIDDEN_SYMBOLS);
                        await expect(detailsComponent.field).toHaveValue("");
                    });

                    await test.step("• text cannot have more than 9000 symbols", async () => {
                        const largeText = generateText(9000);
                        await detailsComponent.fillDetails(largeText);
                        await detailsComponent.typeDetails("1");
                        await expect(detailsComponent.field).toHaveValue(
                            largeText,
                        );
                    });
                });
            },
        );

        test(
            "Verify vehicle location division",
            {
                tag: "@field validation",
                annotation: { type: "Test case", description: "C319" },
            },
            async ({ createUnitPage, locationComponent, page }) => {
                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${tabsFields.location.label}» text`, async () => {
                        await expect(locationComponent.label).toContainText(
                            tabsFields.location.label,
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(locationComponent.label).toBeVisible();
                    });

                    await test.step("• has an asterisk", async () => {
                        await expect(
                            locationComponent.requiredSymbol!,
                        ).toBeVisible();
                    });
                });

                await test.step("The field has the correct background text", async () => {
                    await expect(locationComponent.locationLabel).toHaveText(
                        tabsFields.location.placeholder,
                    );
                });

                await test.step("The field must be filled in", async () => {
                    await createUnitPage.nextStep();
                    await expectFieldError(locationComponent.locationLabel);
                    await expect(locationComponent.errorBlock).toHaveText(
                        FIELDS_ERRORS.MISSING_LOCATION,
                    );
                });

                await test.step(`The «${tabsFields.location.buttonText}» button opens the modal window`, async () => {
                    await locationComponent.openMap();
                    await expect(locationComponent.modalWindow).toBeVisible();
                });

                await test.step("The modal window: ⤵️", async () => {
                    await test.step("• has the correct title and Close button", async () => {
                        await expect(
                            locationComponent.modalWindowTitle,
                        ).toHaveText(tabsFields.location.modal.title);
                        await expect(
                            locationComponent.modalWindowCloseButton,
                        ).toBeVisible();
                    });

                    await test.step(`• has the “${DEFAULT_LOCATION}” as the default address`, async () => {
                        await expect(
                            locationComponent.modalWindowAddressLabel,
                        ).toHaveText(`${DEFAULT_LOCATION}`);
                    });

                    await test.step("• disappears after clicking the Close button", async () => {
                        await locationComponent.closeMap();
                        await expect(
                            locationComponent.modalWindow,
                        ).toBeHidden();
                    });
                });

                await test.step("Valid address is NOT displayed in address field after closing the modal window", async () => {
                    if (await locationComponent.modalWindow.isHidden())
                        await locationComponent.openMap();
                    await clickOutside(page);
                    await expect(
                        locationComponent.locationLabel,
                    ).not.toHaveText(DEFAULT_LOCATION);
                });
            },
        );

        test(
            `Verify “${BUTTONS.cancel}” button`,
            {
                tag: ["@button validation"],
                annotation: { type: "Test case", description: "C326" },
            },
            async ({ createUnitPage, page }) => {
                await test.step("The button has the correct text", async () => {
                    await expect(createUnitPage.cancelButton).toHaveText(
                        BUTTONS.cancel,
                    );
                });

                await test.step("Clicking on the button cancels the ad creation and redirects to the main page", async () => {
                    await createUnitPage.cancelAdCreating();
                    await expect(page).toHaveURL(
                        new RegExp(`${endpoints.home}`),
                    );
                });
            },
        );

        test(
            `Verify “Далі” button`,
            {
                tag: ["@button validation"],
                annotation: { type: "Test case", description: "C329" },
            },
            async ({
                createUnitPage,
                categoryComponent,
                adComponent,
                manufacturerComponent,
                locationComponent,
                photosComponent,
            }) => {
                await test.step("The button has the correct text", async () => {
                    await expect(createUnitPage.nextButton).toHaveText(
                        BUTTONS.next,
                    );
                });

                await test.step("Warnings are displayed about the need to fill in mandatory fields", async () => {
                    await createUnitPage.nextStep();
                    await expect(categoryComponent.errorBlock).toBeVisible();
                    await expect(adComponent.errorBlock).toBeVisible();
                    await expect(
                        manufacturerComponent.errorBlock,
                    ).toBeVisible();
                    await expect(locationComponent.errorBlock).toBeVisible();
                });

                await test.step("When the required fields are filled in, clicking on the button: ⤵️", async () => {
                    await test.step("• displays the next tab", async () => {
                        await categoryComponent.selectCategory();
                        await adComponent.typeAd(generateValidText());
                        await manufacturerComponent.setManufacturer(
                            getRandomStringElement(MANUFACTURERS),
                        );
                        await locationComponent.selectLocation();

                        await createUnitPage.nextStep();

                        await expectTabActive(createUnitPage.tabList.nth(1));
                        await expect(
                            photosComponent.uploadPhotoButtonsWrapper,
                        ).toBeVisible();
                    });

                    await test.step("• keeps the page title visibility and text unchanged", async () => {
                        await expect(createUnitPage.pageTitle).toBeVisible();
                        await expect(createUnitPage.pageTitle).toHaveText(
                            CREATE_UNIT_CONSTS.PAGE_TITLE,
                        );
                    });

                    await test.step("• keeps inactive tabs unchanged", async () => {
                        for (let i = 0; i < TAB_NUMBERS.length; i++) {
                            if (i === 1) continue;

                            await expectTabInactive(
                                createUnitPage.tabList.nth(i),
                            );

                            const { title: tabTitle, number: tabNumber } =
                                await createUnitPage.getTabMetaInfo(
                                    TAB_NUMBERS[i],
                                );
                            expect(tabTitle).toEqual(TAB_TITLES[i]);
                            expect(tabNumber).toEqual(TAB_NUMBERS[i]);
                        }
                    });
                });
            },
        );
    },
);
