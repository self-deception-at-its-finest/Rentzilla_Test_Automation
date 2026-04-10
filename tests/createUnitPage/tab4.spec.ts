import {
	BUTTONS,
	createUnitConsts as data,
	TAB_NUMBERS,
	TAB_TITLES,
} from "@constants/create-unit/createUnit.constants";
import { DROPDOWN_ICON, SELECT_ICON, tabs } from "@constants/create-unit/fields.constants";
import { ENDPOINTS } from "@constants/endpoints.constants";
import { test, expect } from "@fixtures/indexV2";
import { expectFieldError, expectTabActive, expectTabInactive, expectTextColorError } from "@utils/uiMatchers";

test.describe(
	"“Create unit” page | The “Price” tab",
	{
		annotation: [
			{ type: "Testing page", description: "«Створення оголошення»" },
			{ type: "Path to page", description: ENDPOINTS.CREATE_UNIT },
		],
	},
	() => {
		test(
			"Verify dropdown’s text and options on the “Price” tab",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C417" },
			},
			async ({ createUnitPageWithFilledThreeTabs: page }) => {
				await test.step("The payment method title: ⤵️", async () => {
					await test.step("• is visible", async () => {
						await expect(page.priceTab.paymentLabel).toBeVisible();
					});

					await test.step("• has the “Спосіб оплати” text", async () => {
						await expect(page.priceTab.paymentLabel).toContainText(tabs.price.paymentMethodLabel);
					});

					await test.step("• has the asterisk symbol", async () => {
						await expect(page.priceTab.paymentRequiredSymbol).toBeVisible();
					});
				});

				await test.step("The “Готівкою / на картку” option is displayed as default", async () => {
					await expect(page.priceTab.selectedPaymentMethod).toHaveText(tabs.price.paymentMethods.cash);
				});

				await test.step("After clicking on field dropdown appeared with options: “Готівкою / на картку”, “Безготівковий розрахунок (без ПДВ)”, “Безготівковий розрахунок (з ПДВ)”", async () => {
					await page.priceTab.openPaymentMethodDropdown();
					const allResults = await page.priceTab.allDropdownItems.allTextContents();
					const methods = Object.values(tabs.price.paymentMethods);
					expect([...allResults].sort()).toEqual([...methods].sort());
					await page.priceTab.closePaymentMethodDropdown();
				});

				await test.step("After clicking on the variants they are displayed in the field", async () => {
					const methodsCount = await page.priceTab.allDropdownItems.count();
					for (let i = 0; i < methodsCount; i++) {
						const chosenVariant = await page.priceTab.allDropdownItems.nth(i).innerText();
						await page.priceTab.openPaymentMethodDropdown();
						await page.priceTab.allDropdownItems.nth(i).click();
						await expect(page.priceTab.selectedPaymentMethod).toHaveText(chosenVariant);
					}
				});
			},
		);

		test(
			"Verify “Вартість мінімального замовлення” section",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C418" },
			},
			async ({ createUnitPageWithFilledThreeTabs: page }) => {
				await test.step("The price field title: ⤵️", async () => {
					await test.step("• is visible", async () => {
						await expect(page.priceTab.priceLabel).toBeVisible();
					});

					await test.step("• has the “Вартість мінімального замовлення” text", async () => {
						await expect(page.priceTab.priceLabel).toContainText(tabs.price.priceFieldLabel);
					});

					await test.step("• has the asterisk symbol", async () => {
						await expect(page.priceTab.priceRequiredSymbol).toBeVisible();
					});
				});

				await test.step("The field has the “Наприклад, 1000” background text", async () => {
					await expect(page.priceTab.priceField).toHaveAttribute(
						"placeholder",
						tabs.price.priceFieldPlaceholder,
					);
				});

				await test.step("Validate the field: ⤵️", async () => {
					const validLongPrice = "123456789";

					await test.step("• it cannot have “0” as first symbol", async () => {
						await page.priceTab.clearPriceField();
						await page.priceTab.typePrice("0");
						await expect(page.priceTab.priceField).toHaveValue("");
					});

					await test.step("• its line length limit is 9 digits", async () => {
						const invalidPrice = validLongPrice + "0";

						await page.priceTab.clearPriceField();
						await page.priceTab.typePrice(invalidPrice);
						await expect(page.priceTab.priceField).toHaveValue(validLongPrice);

						await page.priceTab.clearPriceField();
						await page.priceTab.fillPrice(invalidPrice);
						await expect(page.priceTab.priceField).toHaveValue(validLongPrice);
					});

					await test.step("• it cannot have spaces, letters and special symbols", async () => {
						const validValue = "123456";

						await page.priceTab.clearPriceField();
						for (const value of ["123 456", "123456 "]) {
							await page.priceTab.typePrice(value);
							await expect(page.priceTab.priceField).toHaveValue(validValue);
							await page.priceTab.clearPriceField();
							await page.priceTab.fillPrice(value);
							await expect(page.priceTab.priceField).toHaveValue(validValue);
							await page.priceTab.clearPriceField();
						}

						for (const value of [" ", "abc", "!@#$%.,"]) {
							await page.priceTab.typePrice(value);
							await expect(page.priceTab.priceField).toHaveValue("");
							await page.priceTab.fillPrice(value);
							await expect(page.priceTab.priceField).toHaveValue("");
						}
					});

					await test.step("• it can accept the 9-digit string via typing and inserting", async () => {
						await page.priceTab.typePrice(validLongPrice);
						await expect(page.priceTab.priceField).toHaveValue(validLongPrice);
						await page.priceTab.clearPriceField();
						await page.priceTab.fillPrice(validLongPrice);
						await expect(page.priceTab.priceField).toHaveValue(validLongPrice);
					});
				});

				await test.step("The currency field has the “UAH” value", async () => {
					await expect(page.priceTab.priceCurrencyField).toHaveValue("UAH");
				});
			},
		);

		test(
			"Verify adding price for service",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C482" },
			},
			async ({ createUnitPageWithFilledThreeTabs: page }) => {
				await test.step("The service price section has the “Вартість Ваших послуг” title", async () => {
					await expect(page.priceTab.servicePriceLabel).toBeVisible();

					await expect(page.priceTab.servicePriceLabel).toContainText(tabs.price.servicePriceLabel);
				});

				await test.step("The clue line contains “За бажанням Ви можете додати вартість конкретних послуг, які надає технічний засіб”", async () => {
					await expect(page.priceTab.servicePriceDesc).toBeVisible();
					await expect(page.priceTab.servicePriceDesc).toContainText(tabs.price.servicePriceDescription);
				});

				await test.step("The “Додати вартість” button: ⤵️", async () => {
					const addServicePriceButton = page.priceTab.getAddServicePriceButton();

					await test.step("• has the “+” icon", async () => {
						await expect(page.priceTab.getPathElement(addServicePriceButton)).toHaveAttribute(
							"d",
							SELECT_ICON,
						);
					});

					await test.step("• has the “Додати вартість” text", async () => {
						await expect(addServicePriceButton).toHaveText(tabs.price.addServicePrice);
					});

					await test.step("• disappears after clicking on it; input field and select dropdown are appeared", async () => {
						await addServicePriceButton.click();
						await expect(addServicePriceButton).toBeHidden();

						await expect(page.priceTab.servicePriceField).toBeVisible();
						await expect(page.priceTab.servicePriceCurrencyField).toBeVisible();
						await expect(page.priceTab.servicePriceTypeDropdown).toBeVisible();
					});
				});
				await test.step("Validate the service price field: ⤵️", async () => {
					const validLongPrice = "123456789";
					const field = page.priceTab.servicePriceField;

					await test.step("• it cannot have “0” as first symbol", async () => {
						await page.priceTab.typePrice("0", field);
						await expect(field).toHaveValue("");
					});

					await test.step("• its line length limit is 9 digits", async () => {
						const invalidPrice = validLongPrice + "0";

						await page.priceTab.typePrice(invalidPrice, field);
						await expect(field).toHaveValue(validLongPrice);

						await page.priceTab.clearPriceField(field);
						await page.priceTab.fillPrice(invalidPrice, field);
						await expect(field).toHaveValue(validLongPrice);
					});

					await test.step("• it cannot have spaces, letters and special symbols", async () => {
						const validValue = "123456";

						await page.priceTab.clearPriceField(field);
						for (const value of ["123 456", "123456 "]) {
							await page.priceTab.typePrice(value, field);
							await expect(field).toHaveValue(validValue);
							await page.priceTab.clearPriceField(field);
							await page.priceTab.fillPrice(value, field);
							await expect(field).toHaveValue(validValue);
							await page.priceTab.clearPriceField(field);
						}

						for (const value of [" ", "abc", "!@#$%.,"]) {
							await page.priceTab.typePrice(value, field);
							await expect(field).toHaveValue("");
							await page.priceTab.fillPrice(value, field);
							await expect(field).toHaveValue("");
						}
					});

					await test.step("• it can accept the 9-digit string via typing and inserting", async () => {
						await page.priceTab.typePrice(validLongPrice, field);
						await expect(field).toHaveValue(validLongPrice);
						await page.priceTab.clearPriceField(field);
						await page.priceTab.fillPrice(validLongPrice, field);
						await expect(field).toHaveValue(validLongPrice);
					});
				});

				await test.step("The currency of service field has the “UAH” value", async () => {
					await expect(page.priceTab.servicePriceCurrencyField).toHaveValue("UAH");
				});

				await test.step("The “Per unit” dropdown: ⤵️", async () => {
					const perUnitField = page.priceTab.servicePriceTypeDropdown;

					await test.step("• has “Година” value", async () => {
						await expect(perUnitField).toHaveText(tabs.price.servicePriceTypes.h, { ignoreCase: true });
					});

					await test.step("• has the “arrow down” icon", async () => {
						await expect(page.priceTab.getPathElement(perUnitField)).toHaveAttribute("d", DROPDOWN_ICON);
					});
				});

				await test.step("After clicking the “Per unit” dropdown, the correct options are displayed", async () => {
					await page.priceTab.openServicePriceTypeDropdown();
					const allTypes = page.priceTab.allDropdownItems;
					await page.priceTab.openServicePriceTypeDropdown();

					const allResultsTextArray = (await allTypes.allTextContents()).map((i) => i.toLowerCase());

					const types = Object.values(tabs.price.servicePriceTypes).map((i) => i.toLowerCase());

					expect([...allResultsTextArray].sort()).toEqual([...types].sort());
				});

				await test.step("After clicking an option in “Per unit” dropdown, it is displayed as the chosen option", async () => {
					await page.priceTab.openServicePriceTypeDropdown();
					const allTypes = page.priceTab.allDropdownItems;
					const typesCount = await allTypes.count();

					for (let i = 0; i < typesCount; i++) {
						await page.priceTab.openServicePriceTypeDropdown();
						const chosenOption = await allTypes.nth(i).innerText();
						await page.priceTab.chooseItem(allTypes.nth(i));
						await expect(page.priceTab.servicePriceTypeDropdown).toHaveText(chosenOption, {
							ignoreCase: true,
						});
					}
				});

				await test.step("Selecting the “Shift” type reveals a new field", async () => {
					const shiftField = page.priceTab.serviceShiftDropdown;

					await page.priceTab.openServiceShiftDropdown();
					await page.priceTab.chooseItem(page.priceTab.allDropdownItems.nth(1));
					await expect(shiftField).toBeVisible();
				});

				await test.step("The shift dropdown has: ⤵️", async () => {
					const shiftField = page.priceTab.serviceShiftDropdown;

					await test.step("• the “8 год” value", async () => {
						await expect(shiftField).toHaveText(tabs.price.shifts.eight);
					});

					await test.step("• has the “arrow down” icon", async () => {
						await expect(page.priceTab.getPathElement(shiftField)).toHaveAttribute("d", DROPDOWN_ICON);
					});
				});

				await test.step("After clicking the shift dropdown, it shows the correct options", async () => {
					await page.priceTab.openServiceShiftDropdown();
					const allShifts = page.priceTab.allDropdownItems;

					const allResultsTextArray = (await allShifts.allTextContents()).map((i) => i.toLowerCase());

					const shifts = Object.values(tabs.price.shifts).map((i) => i.toLowerCase());

					expect([...allResultsTextArray].sort()).toEqual([...shifts].sort());
				});

				await test.step("After clicking an option in “Shift” dropdown, it is displayed as the chosen option", async () => {
					await page.priceTab.openServiceShiftDropdown();
					const allShifts = page.priceTab.allDropdownItems;
					const shiftsCount = await allShifts.count();

					for (let i = 0; i < shiftsCount; i++) {
						await page.priceTab.openServiceShiftDropdown();
						const chosenOption = await allShifts.nth(i).innerText();
						await page.priceTab.chooseItem(allShifts.nth(i));
						await expect(page.priceTab.serviceShiftDropdown).toHaveText(chosenOption, {
							ignoreCase: true,
						});
					}
				});

				await test.step("After clicking on the delete service price button, the service price is deleted", async () => {
					await page.priceTab.removeServicePrice();
					await expect(page.priceTab.priceField).toHaveCount(1);
					await expect(page.priceTab.getAddServicePriceButton()).toBeVisible();
				});
			},
		);

		test(
			`Verify “Назад” button`,
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C488" },
			},
			async ({ createUnitPageWithFilledThreeTabs: page }) => {
				await test.step("The button has the correct text", async () => {
					await expect(page.cancelButton).toHaveText(BUTTONS.BACK);
				});
				await test.step(`The user is redirected to the previous tab after clicking the “Назад” button`, async () => {
					await page.previousStep();
					await expectTabActive(page.tabList.nth(2));
					for (let i = 0; i < TAB_NUMBERS.length; i++) {
						if (i === 2) continue;
						await expectTabInactive(page.tabList.nth(i));
					}
				});

				await test.step("The data in the third tab is saved", async () => {
					expect(page.serviceTab.selectedServicesSection).toBeVisible();
				});
			},
		);

		test(
			`Verify “Далі” button`,
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C489" },
			},
			async ({ createUnitPageWithFilledThreeTabs: page }) => {
				await test.step("The button has the correct text", async () => {
					await expect(page.nextButton).toHaveText(BUTTONS.NEXT);
				});

				await test.step("After clicking the «Далі» button the color of the price field and the field’s error message is red if user didn’t set the price", async () => {
					await page.nextStep();
					await expectFieldError(page.priceTab.getPriceFieldWrapper());
					await expectTextColorError(page.priceTab.requiredMessage);
				});

				await test.step("The user can proceed to the next tab after filling in the field", async () => {
					await page.priceTab.fillPrice("1000");

					await page.nextStep();

					await expectTabActive(page.tabList.nth(4));

					await expect(page.pageTitle).toBeVisible();

					await expect(page.pageTitle).toHaveText(data.pageTitle);
				});

				await test.step("Other tabs are inactive and unchanged", async () => {
					for (let i = 0; i < TAB_NUMBERS.length; i++) {
						if (i === 4) continue;

						await expectTabInactive(page.tabList.nth(i));

						const { title: tabTitle, number: tabNumber } = await page.getTabMetaInfo(TAB_NUMBERS[i]);
						expect(tabTitle).toEqual(TAB_TITLES[i]);
						expect(tabNumber).toEqual(TAB_NUMBERS[i]);
					}
				});
			},
		);
	},
);
