import { expect, test } from "../../fixtures/fixtures";
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
import { CategoryComponent } from "../../components/create-unit/1/t-Category.component";
import { AdComponent } from "../../components/create-unit/1/t-Ad.component";
import { getFieldPlaceholder } from "../../utils/formHelper";
import { firstTabFields } from "../../constants/create-unit/fields.constants";
import { ManufacturerComponent } from "../../components/create-unit/1/t-Manufacturer.component";
import {
    generateText,
    generateMediumText,
    generateShortText,
} from "../../utils/fakeData";
import { formatMissingManufacturerError } from "../../utils/formatManufacturerError";
import { getRandomStringElement } from "../../utils/getElements";
import { ModelComponent } from "../../components/create-unit/1/t-Model.component";
import { SpecificationsComponent } from "../../components/create-unit/1/t-Specifications.component";
import { DetailsComponent } from "../../components/create-unit/1/t-Details.component";
import { LocationComponent } from "../../components/create-unit/1/t-Location.component";
import { PhotosComponent } from "../../components/create-unit/2/t-Photos.component";

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
            async ({ createUnitPage, page }) => {
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
                        expect(createUnitPage.tabList.first()).toHaveAttribute(
                            "aria-selected",
                            "true",
                        );
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
                            expect(
                                createUnitPage.tabList.nth(i),
                            ).toHaveAttribute("aria-selected", "false");
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
                tag: "@UI",
                annotation: { type: "Test case", description: "C296" },
            },
            async ({ createUnitPage, page }) => {
                const categoryComponent = new CategoryComponent(page);

                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${firstTabFields.category.label}» text`, async () => {
                        await expect(categoryComponent.label).toContainText(
                            firstTabFields.category.label,
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
                    await test.step(`• has the «${firstTabFields.category.placeholder}» background text`, async () => {
                        await expect(
                            categoryComponent.fieldPlaceholder,
                        ).toHaveText(firstTabFields.category.placeholder);
                    });

                    await test.step("• to contain arrow in the right side of field. ", async () => {
                        await expect(
                            categoryComponent.fieldArrow,
                        ).toBeVisible();
                    });

                    await test.step("• requires filling.", async () => {
                        await createUnitPage.nextStep();

                        await expect(categoryComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${CREATE_UNIT_CONSTS.ERR_BORDER_COLOR}`,
                        );

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
                            ? firstTabFields.category.popupTitle
                            : firstTabFields.category.mobPopupTitle
                    }» title`, async () => {
                        await expect(categoryComponent.popupTitle).toHaveText(
                            isDesktop(page)
                                ? firstTabFields.category.popupTitle
                                : firstTabFields.category.mobPopupTitle,
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
                        // Open the category popup if hidden
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
            async ({ createUnitPage, page }) => {
                const adComponent = new AdComponent(page);
                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${firstTabFields.ad.label}» text`, async () => {
                        await expect(adComponent.label).toContainText(
                            firstTabFields.ad.label,
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
                    await test.step(`• has the «${firstTabFields.ad.placeholder}» background text`, async () => {
                        expect(
                            await getFieldPlaceholder(adComponent.field),
                        ).toEqual(firstTabFields.ad.placeholder);
                    });

                    await test.step("• requires filling", async () => {
                        await createUnitPage.nextStep();

                        await expect(adComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${CREATE_UNIT_CONSTS.ERR_BORDER_COLOR}`,
                        );

                        await expect(adComponent.errorBlock).toBeVisible();

                        await expect(adComponent.errorBlock).toHaveText(
                            FIELDS_ERRORS.EMPTY,
                        );
                    });
                });

                await test.step("Validate field requirements: ⤵️", async () => {
                    const less10 = generateShortText();
                    const validText = generateMediumText();
                    const more100 = generateText(101);

                    await test.step("• string cannot be less than 10 symbols", async () => {
                        await adComponent.typeAd(less10);
                        await createUnitPage.nextStep();

                        await expect(adComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${CREATE_UNIT_CONSTS.ERR_BORDER_COLOR}`,
                        );
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
                        await expect(adComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${CREATE_UNIT_CONSTS.ERR_BORDER_COLOR}`,
                        );
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
                        await expect(adComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${CREATE_UNIT_CONSTS.BORDER_COLOR}`,
                        );
                        await expect(adComponent.errorBlock).toBeHidden();
                    });
                });
            },
        );

        test(
            "Verify vehicle manufacturer section",
            {
                tag: "@UI",
                annotation: { type: "Test case", description: "C298" },
            },
            async ({ createUnitPage, page }) => {
                const manufacturerComponent = new ManufacturerComponent(page);
                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${firstTabFields.manufacturer.label}» text`, async () => {
                        await expect(manufacturerComponent.label).toContainText(
                            firstTabFields.manufacturer.label,
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
                    await test.step(`• has the «${firstTabFields.manufacturer.placeholder}» background text`, async () => {
                        expect(
                            await getFieldPlaceholder(
                                manufacturerComponent.field,
                            ),
                        ).toEqual(firstTabFields.manufacturer.placeholder);
                    });

                    await test.step("• requires filling", async () => {
                        await createUnitPage.nextStep();

                        await expect(
                            manufacturerComponent.fieldWrapper,
                        ).toHaveCSS(
                            "border",
                            `1px solid ${CREATE_UNIT_CONSTS.ERR_BORDER_COLOR}`,
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
                        await manufacturerComponent.setTheManufacturer(
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
            async ({ createUnitPage, page }) => {
                const modelComponent = new ModelComponent(page);

                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${firstTabFields.model.label}» text`, async () => {
                        await expect(modelComponent.label).toContainText(
                            firstTabFields.model.label,
                        );
                    });

                    await test.step("• is visible", async () => {
                        await expect(modelComponent.label).toBeVisible();
                    });
                });

                await test.step(`The field has the «${firstTabFields.model.placeholder}» background text`, async () => {
                    expect(
                        await getFieldPlaceholder(modelComponent.field),
                    ).toEqual(firstTabFields.model.placeholder);
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

                            await expect(modelComponent.field).toHaveCSS(
                                "border",
                                `1px solid ${CREATE_UNIT_CONSTS.ERR_BORDER_COLOR}`,
                            );

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
                        await expect(modelComponent.field).toHaveCSS(
                            "border",
                            `1px solid ${CREATE_UNIT_CONSTS.BORDER_COLOR}`,
                        );
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
            async ({ createUnitPage, page }) => {
                await test.step("Field validation: ⤵️", async () => {
                    const specificationsComponent = new SpecificationsComponent(
                        page,
                    );

                    await test.step(`• text cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
                        await specificationsComponent.typeSpecifications(
                            FORBIDDEN_SYMBOLS,
                        );
                        await expect(specificationsComponent.field).toHaveValue(
                            "",
                        );
                    });

                    await test.step("• text cannot have more than 9000 symbols", async () => {
                        const largeText = generateText(9000);
                        console.log(largeText);
                        await specificationsComponent.field.fill(largeText);
                        await specificationsComponent.typeSpecifications("1");
                        await expect(specificationsComponent.field).toHaveText(
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
            async ({ createUnitPage, page }) => {
                await test.step("Field validation: ⤵️", async () => {
                    const detailsComponent = new DetailsComponent(page);

                    await test.step(`• text cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
                        await detailsComponent.typeDetails(FORBIDDEN_SYMBOLS);
                        await expect(detailsComponent.field).toHaveValue("");
                    });

                    await test.step("• text cannot have more than 9000 symbols", async () => {
                        const largeText = generateText(9000);
                        console.log(largeText);
                        await detailsComponent.field.fill(largeText);
                        await detailsComponent.typeDetails("1");
                        await expect(detailsComponent.field).toHaveText(
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
            async ({ createUnitPage, page }) => {
                const locationComponent = new LocationComponent(page);

                await test.step("The title: ⤵️", async () => {
                    await test.step(`• has the «${firstTabFields.location.label}» text`, async () => {
                        await expect(locationComponent.label).toContainText(
                            firstTabFields.location.label,
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
                    await expect(locationComponent.mapLabel).toHaveText(
                        firstTabFields.location.placeholder,
                    );
                });

                await test.step("The field must be filled in", async () => {
                    await createUnitPage.nextStep();
                    await expect(locationComponent.mapLabel).toHaveCSS(
                        "border",
                        `1px solid ${CREATE_UNIT_CONSTS.ERR_BORDER_COLOR}`,
                    );
                    await expect(locationComponent.errorBlock).toHaveText(
                        FIELDS_ERRORS.MISSING_LOCATION,
                    );
                });

                await test.step(`The «${firstTabFields.location.buttonText}» button opens the modal window`, async () => {
                    await locationComponent.openTheMap();
                    await expect(locationComponent.modalWindow).toBeVisible();
                });

                await test.step("The modal window: ⤵️", async () => {
                    await test.step("• has the correct title and Close button", async () => {
                        await expect(
                            locationComponent.modalWindowTitle,
                        ).toHaveText(firstTabFields.location.modal.title);
                        await expect(
                            locationComponent.modalWindowCloseButton,
                        ).toBeVisible();
                    });

                    await test.step("• has “Київ, Україна, Київська область” the as default address", async () => {
                        await expect(
                            locationComponent.modalWindowAddressLabel,
                        ).toHaveText("Київ, Україна, Київська область");
                    });

                    await test.step("• disappears after clicking the Close button", async () => {
                        await locationComponent.closeTheMap();
                        await expect(
                            locationComponent.modalWindow,
                        ).toBeHidden();
                    });
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
            `Verify “${BUTTONS.next}” button`,
            {
                tag: ["@button validation"],
                annotation: { type: "Test case", description: "C329" },
            },
            async ({ createUnitPage, page }) => {
                await test.step("The button has the correct text", async () => {
                    await expect(createUnitPage.nextButton).toHaveText(
                        BUTTONS.next,
                    );
                });

                const categoryComponent = new CategoryComponent(page);
                const adComponent = new AdComponent(page);
                const manufacturerComponent = new ManufacturerComponent(page);
                const locationComponent = new LocationComponent(page);

                await test.step("Warnings are displayed about the need to fill in mandatory fields", async () => {
                    await createUnitPage.nextStep();
                    await expect(categoryComponent.errorBlock).toBeVisible();
                    await expect(adComponent.errorBlock).toBeVisible();
                    await expect(
                        manufacturerComponent.errorBlock,
                    ).toBeVisible();
                    await expect(locationComponent.errorBlock).toBeVisible();
                });

                await test.step("Clicking on the button displays the next tab when the required fields are filled in.", async () => {
                    await categoryComponent.selectTheCategory();
                    await adComponent.typeAd(generateMediumText());
                    await manufacturerComponent.setTheManufacturer(
                        getRandomStringElement(MANUFACTURERS),
                    );
                    await locationComponent.selectLocation();

                    await createUnitPage.nextStep();

                    await expect(
                        new PhotosComponent(page).uploadPhotoButtons,
                    ).toBeVisible();
                });
            },
        );
    },
);
