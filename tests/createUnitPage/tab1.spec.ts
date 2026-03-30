import { expect, test } from "@fixtures/indexV2";
import {
	BUTTONS,
	createUnitConsts as data,
	FORBIDDEN_SYMBOLS,
	MANUFACTURERS,
	TAB_NUMBERS,
	TAB_TITLES,
} from "@constants/create-unit/createUnit.constants";
import { FIELDS_ERRORS } from "@constants/create-unit/createUnit.constants";
import endpoints from "@constants/endpoints.constants.json";
import catalog from "@constants/catalog.constants.json";
import { isDesktop } from "@utils/viewportGuard";
import { markStepAsSkipped } from "@utils/skipTest";
import { getFieldPlaceholder } from "@utils/formHelper";
import { DEFAULT_LOCATION, tabs } from "@constants/create-unit/fields.constants";
import { generateText, generateValidText } from "@utils/fakeData";
import { formatMissingManufacturerError } from "@utils/formatErrorMessages";
import { getRandomElement } from "@utils/getElements";
import { expectFieldDefault, expectFieldError, expectTabActive, expectTabInactive } from "@utils/uiMatchers";
import { clickOutside } from "@utils/closeModal";

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
			async ({ createUnitPage: page, categoryComponent: category }) => {
				await test.step("The page title is: ⤵️", async () => {
					await test.step("• visible", async () => {
						await expect(page.pageTitle).toBeVisible();
					});
					await test.step("• correct", async () => {
						await expect(page.pageTitle).toHaveText(data.pageTitle);
					});
				});

				await test.step(`The first tab: ⤵️`, async () => {
					await test.step(`• is selected`, async () => {
						await expectTabActive(page.tabList.first());
					});

					await test.step(`• has the “Основна інформація” title`, async () => {
						await expect(category.tabTitle).toHaveText(tabs.mainInfo.title);
					});

					await test.step(`• has the “1” number.`, async () => {
						await expect(page.tabList.first()).toContainText(TAB_NUMBERS[0]);
					});
				});

				await test.step("Other tabs: ⤵️", async () => {
					await test.step("• are not active", async () => {
						for (let i = 1; i < TAB_NUMBERS.length; i++) {
							await expectTabInactive(page.tabList.nth(i));
						}
					});

					await test.step(`• have these titles: ${TAB_TITLES.map((title) => `«${title}»`).join(
						", ",
					)}`, async () => {
						for (let i = 1; i < TAB_NUMBERS.length; i++) {
							const { title: tabTitle } = await page.getTabMetaInfo(TAB_NUMBERS[i]);

							expect(tabTitle).toEqual(TAB_TITLES[i]);
						}
					});

					await test.step("• have correct numbers.", async () => {
						for (let i = 1; i < TAB_NUMBERS.length; i++) {
							const tabKey = TAB_NUMBERS[i];
							const { number: tabNumber } = await page.getTabMetaInfo(tabKey);
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
			async ({ createUnitPage, categoryComponent: category, userPage: page }) => {
				await test.step("The title: ⤵️", async () => {
					await test.step(`• has the «Категорія» text`, async () => {
						await expect(category.label).toContainText(tabs.mainInfo.category.label);
					});

					await test.step("• is visible", async () => {
						await expect(category.label).toBeVisible();
					});

					await test.step("• has an asterisk.", async () => {
						await expect(category.requiredSymbol!).toBeVisible();
					});
				});

				await test.step("The input field: ⤵️", async () => {
					await test.step(`• has the «Виберіть категорію» background text`, async () => {
						await expect(category.fieldPlaceholder).toHaveText(tabs.mainInfo.category.placeholder);
					});

					await test.step("• to contain arrow in the right side of field. ", async () => {
						await expect(category.fieldArrow).toBeVisible();
					});

					await test.step("• requires filling.", async () => {
						await createUnitPage.nextStep();
						await expectFieldError(category.field);

						await expect(category.errorBlock).toBeVisible();

						await expect(category.errorBlock).toHaveText(FIELDS_ERRORS.EMPTY);
					});
				});

				await test.step("The category popup: ⤵️", async () => {
					await test.step("• opens when the field is clicked", async () => {
						category.clickCategorySelect();
						await expect(category.popup).toBeVisible();
					});

					await test.step(`• has the «Вибір категорії технічного засобу» title`, async () => {
						await expect(category.popupTitle).toHaveText(
							isDesktop(page)
								? tabs.mainInfo.category.popupTitle
								: tabs.mainInfo.category.mobilePopupTitle,
						);
					});

					await test.step("• has the Close button", async () => {
						await expect(category.popupCloseBtn).toBeVisible();
					});

					await test.step("• disappears when the Close button is clicked", async () => {
						await category.clickCloseBtn();
						await expect(category.popup).toBeHidden();
					});

					await test.step("• disappears when clicking outside of it", async () => {
						if (!isDesktop(page)) {
							markStepAsSkipped("Clicking outside of modal");
							return;
						}
						await category.clickCategorySelect();
						await clickOutside(page);
						await expect(category.popup).toBeHidden();
					});

					await test.step("• disappears when chosing the particular category, and the field is filled correctly", async () => {
						if (await category.popup.isHidden()) await category.clickCategorySelect();

						await category.selectFirstCategory();
						await expect(category.secondCategoryList).toBeVisible();

						await category.selectSecondCategory();
						await expect(category.thirdCategoryList).toBeVisible();

						await category.selectThirdCategory();
						await expect(category.popup).toBeHidden();

						// Get the last unit title
						const pileDrivingTitle =
							catalog["special equipment"].categories["building equipment"].subcategories["drilling rigs"]
								.subcategories["pile-driving rigs"].title;

						await expect(category.fieldPlaceholder).toHaveText(new RegExp(`^${pileDrivingTitle}$`, "i"));
					});
				});
			},
		);

		test(
			"Verify unit name section",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C297" },
			},
			async ({ createUnitPage: page, adComponent: ad }) => {
				await test.step("The title: ⤵️", async () => {
					await test.step(`• has the «Назва оголошення» text`, async () => {
						await expect(ad.label).toContainText(tabs.mainInfo.ad.label);
					});

					await test.step("• is visible", async () => {
						await expect(ad.label).toBeVisible();
					});

					await test.step("• has an asterisk", async () => {
						await expect(ad.requiredSymbol!).toBeVisible();
					});
				});

				await test.step("The input field: ⤵️", async () => {
					await test.step(`• has the «Введіть назву оголошення» background text`, async () => {
						expect(await getFieldPlaceholder(ad.field)).toEqual(tabs.mainInfo.ad.placeholder);
					});

					await test.step("• requires filling", async () => {
						await page.nextStep();

						await expectFieldError(ad.field);

						await expect(ad.errorBlock).toBeVisible();

						await expect(ad.errorBlock).toHaveText(FIELDS_ERRORS.EMPTY);
					});
				});

				await test.step("Validate field requirements: ⤵️", async () => {
					const less10 = generateText(9);
					const validText = generateValidText();
					const more100 = generateText(101);

					await test.step("• string cannot be less than 10 symbols", async () => {
						await ad.typeAd(less10);
						await page.nextStep();

						await expectFieldError(ad.field);
						await expect(ad.errorBlock).toBeVisible();
						await expect(ad.errorBlock).toHaveText(FIELDS_ERRORS.LESS_10_SYMBOLS);
						await ad.clearAdField();
					});

					await test.step("• string cannot be more than 100 symbols", async () => {
						await ad.typeAd(more100);
						await page.nextStep();

						await expect(ad.field).toHaveText("");
						await expectFieldError(ad.field);
						await expect(ad.errorBlock).toBeVisible();
						await expect(ad.errorBlock).toHaveText(FIELDS_ERRORS.MORE_100_SYMBOLS);
						await ad.clearAdField();
					});

					await test.step(`• string cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
						await ad.typeAd(FORBIDDEN_SYMBOLS);
						await expect(ad.field).toHaveValue("");
					});

					await test.step("• string can contain from 10 to 100 symbols", async () => {
						await ad.typeAd(validText);
						await expect(ad.field).toHaveValue(validText);
						await expectFieldDefault(ad.field);
						await expect(ad.errorBlock).toBeHidden();
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
			async ({ createUnitPage: page, manufacturerComponent: manufacturer }) => {
				await test.step("The title: ⤵️", async () => {
					await test.step(`• has the «Виробник транспортного засобу» text`, async () => {
						await expect(manufacturer.label).toContainText(tabs.mainInfo.manufacturer.label);
					});

					await test.step("• is visible", async () => {
						await expect(manufacturer.label).toBeVisible();
					});

					await test.step("• has an asterisk", async () => {
						await expect(manufacturer.requiredSymbol!).toBeVisible();
					});
				});

				await test.step("The input field: ⤵️", async () => {
					await test.step(`• has the «Введіть виробника транспортного засобу» background text`, async () => {
						expect(await getFieldPlaceholder(manufacturer.field)).toEqual(
							tabs.mainInfo.manufacturer.placeholder,
						);
					});

					await test.step("• requires filling", async () => {
						await page.nextStep();

						await expectFieldError(manufacturer.fieldWrapper);

						await expect(manufacturer.errorBlock).toBeVisible();

						await expect(manufacturer.errorBlock).toHaveText(FIELDS_ERRORS.EMPTY);
					});

					await test.step("• shows the correct message about missing manufacturer", async () => {
						await manufacturer.clearManufacturerField();
						const fakeManufacturer = "123456789";
						await manufacturer.typeManufacturer(fakeManufacturer);
						await expect(manufacturer.missingResults).toHaveText(
							formatMissingManufacturerError(fakeManufacturer),
						);
					});
				});

				await test.step("Dropdown list is displayed correct", async () => {
					await manufacturer.clearManufacturerField();
					await manufacturer.typeManufacturer("А");
					await expect(manufacturer.firstResult).toBeVisible();

					await manufacturer.typeManufacturer("тэк");
					const fieldValue = await manufacturer.field.getAttribute("value");
					const result = await manufacturer.firstResult.textContent();

					expect(fieldValue?.toUpperCase()).toEqual(result);

					await manufacturer.clearManufacturerField();
					await manufacturer.typeManufacturer("АТЭК");
					const result2 = await manufacturer.firstResult.textContent();

					expect(fieldValue?.toUpperCase()).toEqual(result2);
					expect(result).toEqual(result2);
				});

				await test.step("Validate field requirements: ⤵️", async () => {
					await test.step("• string cannot be more than 100 symbols", async () => {
						const more100 = generateText(101);

						await manufacturer.clearManufacturerField();
						await manufacturer.typeManufacturer(more100);

						await expect(manufacturer.field).not.toHaveValue(more100);
						await manufacturer.clearManufacturerField();
					});

					await test.step(`• string cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
						await manufacturer.clearManufacturerField();
						await manufacturer.typeManufacturer(FORBIDDEN_SYMBOLS);
						await expect(manufacturer.field).toHaveValue("");
					});

					await test.step("• accept the correct manufacturer", async () => {
						const validManufacturer = getRandomElement(MANUFACTURERS).toLowerCase();

						await manufacturer.clearManufacturerField();
						await manufacturer.setManufacturer(validManufacturer);
						await expect(manufacturer.chosenManufacturer).toHaveText(validManufacturer, {
							ignoreCase: true,
						});
					});

					await test.step("• is cleared by the cross button", async () => {
						await manufacturer.clearManufacturerField();
						await expect(manufacturer.field).toHaveValue("");
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
			async ({ createUnitPage: _, modelComponent: model }) => {
				await test.step("The title: ⤵️", async () => {
					await test.step(`• has the «Назва моделі» text`, async () => {
						await expect(model.label).toContainText(tabs.mainInfo.model.label);
					});

					await test.step("• is visible", async () => {
						await expect(model.label).toBeVisible();
					});
				});

				await test.step(`The field has the «Введіть назву моделі» background text`, async () => {
					expect(await getFieldPlaceholder(model.field)).toEqual(tabs.mainInfo.model.placeholder);
				});

				await test.step("Validate field requirements: ⤵️", async () => {
					await model.clearModelField();

					await test.step("• string cannot be more than 15 symbols", async () => {
						const texts = [
							generateText(16),
							generateText(7) + " " + generateText(8),
							generateText(15) + " ",
						];
						for (const text of texts) {
							await model.typeModel(text);

							await expect(model.errorBlock).toHaveText(FIELDS_ERRORS.MORE_15_SYMBOLS);

							await expectFieldError(model.field);

							await model.clearModelField();
						}
					});

					await test.step(`• string cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
						await model.typeModel(FORBIDDEN_SYMBOLS);
						await expect(model.field).toHaveValue("");
					});

					await test.step("• string accept 15 or less symbols", async () => {
						const text = generateText(15);
						await model.typeModel(text);
						await expectFieldDefault(model.field);
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
			async ({ createUnitPage: _, specificationsComponent: specs }) => {
				await test.step("The Title: ⤵️", async () => {
					await test.step(`• has the «Технічні характеристики» text`, async () => {
						await expect(specs.label).toHaveText(tabs.mainInfo.specifications.label);
					});

					await test.step("• is visible", async () => {
						await expect(specs.label).toBeVisible();
					});
				});

				await test.step("Field is enabled and not “readonly”", async () => {
					await expect(specs.field).toBeEnabled();
					await expect(specs.field).not.toHaveAttribute("readonly", "");
				});

				await test.step("Field is clear", async () => {
					await expect(specs.field).toHaveValue("");
				});

				await test.step("Field validation: ⤵️", async () => {
					await test.step(`• text cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
						await specs.typeSpecifications(FORBIDDEN_SYMBOLS);

						await expect(specs.field).toHaveValue("");
						await specs.fillSpecifications(FORBIDDEN_SYMBOLS);
						await expect(specs.field).toHaveValue("");
					});

					await test.step("• text cannot have more than 9000 symbols", async () => {
						const largeText = generateText(9000);
						await specs.fillSpecifications(largeText);
						await specs.typeSpecifications("1");
						await expect(specs.field).toHaveValue(largeText);
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
			async ({ createUnitPage: _, detailsComponent: details }) => {
				await test.step("The Title: ⤵️", async () => {
					await test.step(`• has the «Детальний опис» text`, async () => {
						await expect(details.label).toHaveText(tabs.mainInfo.details.label);
					});

					await test.step("• is visible", async () => {
						await expect(details.label).toBeVisible();
					});
				});

				await test.step("Field is enabled and not “readonly”", async () => {
					await expect(details.field).toBeEnabled();
					await expect(details.field).not.toHaveAttribute("readonly", "");
				});

				await test.step("Field is clear", async () => {
					await expect(details.field).toHaveValue("");
				});
				await test.step("Field validation: ⤵️", async () => {
					await test.step(`• text cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
						await details.typeDetails(FORBIDDEN_SYMBOLS);
						await expect(details.field).toHaveValue("");
						await details.fillDetails(FORBIDDEN_SYMBOLS);
						await expect(details.field).toHaveValue("");
					});

					await test.step("• text cannot have more than 9000 symbols", async () => {
						const largeText = generateText(9000);
						await details.fillDetails(largeText);
						await details.typeDetails("1");
						await expect(details.field).toHaveValue(largeText);
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
			async ({ createUnitPage: page, locationComponent: location }) => {
				await test.step("The title: ⤵️", async () => {
					await test.step(`• has the «Місце розташування технічного засобу» text`, async () => {
						await expect(location.label).toContainText(tabs.mainInfo.location.label);
					});

					await test.step("• is visible", async () => {
						await expect(location.label).toBeVisible();
					});

					await test.step("• has an asterisk", async () => {
						await expect(location.requiredSymbol!).toBeVisible();
					});
				});

				await test.step("The field has the correct background text", async () => {
					await expect(location.locationLabel).toHaveText(tabs.mainInfo.location.placeholder);
				});

				await test.step("The field must be filled in", async () => {
					await page.nextStep();
					await expectFieldError(location.locationLabel);
					await expect(location.errorBlock).toHaveText(FIELDS_ERRORS.MISSING_LOCATION);
				});

				await test.step(`The «Вибрати на мапі» button opens the modal window`, async () => {
					await location.openMap();
					await expect(location.modalWindow).toBeVisible();
				});

				await test.step("The modal window: ⤵️", async () => {
					await test.step("• has the correct title and Close button", async () => {
						await expect(location.modalWindowTitle).toHaveText(tabs.mainInfo.location.modal.title);
						await expect(location.modalWindowCloseButton).toBeVisible();
					});

					await test.step(`• has the “${DEFAULT_LOCATION}” as the default address`, async () => {
						await expect(location.modalWindowAddressLabel).toHaveText(`${DEFAULT_LOCATION}`);
					});

					await test.step("• disappears after clicking the Close button", async () => {
						await location.closeMap();
						await expect(location.modalWindow).toBeHidden();
					});
				});
			},
		);

		test(
			`Verify “Скасувати” button`,
			{
				tag: ["@button validation"],
				annotation: { type: "Test case", description: "C326" },
			},
			async ({ createUnitPage, userPage: page }) => {
				await test.step("The button has the correct text", async () => {
					await expect(createUnitPage.cancelButton).toHaveText(BUTTONS.CANCEL);
				});

				await test.step("Clicking on the button cancels the ad creation and redirects to the main page", async () => {
					await createUnitPage.cancelAdCreating();
					await expect(page).toHaveURL(new RegExp(`${endpoints.home}`));
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
				createUnitPage: page,
				categoryComponent: category,
				adComponent: ad,
				manufacturerComponent: manufacturer,
				locationComponent: location,
				photosComponent: photos,
			}) => {
				await test.step("The button has the correct text", async () => {
					await expect(page.nextButton).toHaveText(BUTTONS.NEXT);
				});

				await test.step("Warnings are displayed about the need to fill in mandatory fields", async () => {
					await page.nextStep();
					await expect(category.errorBlock).toBeVisible();
					await expect(ad.errorBlock).toBeVisible();
					await expect(manufacturer.errorBlock).toBeVisible();
					await expect(location.errorBlock).toBeVisible();
				});

				await test.step("When the required fields are filled in, clicking on the button: ⤵️", async () => {
					await test.step("• displays the next tab", async () => {
						await category.selectCategory();
						await ad.typeAd(generateValidText());
						await manufacturer.setManufacturer(getRandomElement(MANUFACTURERS));
						await location.selectLocation();

						await page.nextStep();

						await expectTabActive(page.tabList.nth(1));
						await expect(photos.uploadPhotoButtonsWrapper).toBeVisible();
					});

					await test.step("• keeps the page title visibility and text unchanged", async () => {
						await expect(page.pageTitle).toBeVisible();
						await expect(page.pageTitle).toHaveText(data.pageTitle);
					});

					await test.step("• keeps inactive tabs unchanged", async () => {
						for (let i = 0; i < TAB_NUMBERS.length; i++) {
							if (i === 1) continue;

							await expectTabInactive(page.tabList.nth(i));

							const { title: tabTitle, number: tabNumber } = await page.getTabMetaInfo(TAB_NUMBERS[i]);
							expect(tabTitle).toEqual(TAB_TITLES[i]);
							expect(tabNumber).toEqual(TAB_NUMBERS[i]);
						}
					});
				});
			},
		);
	},
);
