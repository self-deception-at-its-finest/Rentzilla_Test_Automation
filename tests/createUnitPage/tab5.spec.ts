import { env } from "@config/env";
import { CODES } from "@constants/codes.constants";
import { FIELDS_ERRORS } from "@constants/create-unit/createUnit.constants";
import { tabs } from "@constants/create-unit/fields.constants";
import { ENDPOINTS } from "@constants/endpoints.constants";
import { test, expect } from "@fixtures/indexV2";
import { CreateUnitPage } from "@pages/CreateUnit.page";
import {
	FieldData,
	validateFieldByBothMethods,
	validateFillInField,
	validateTypeIntoField,
} from "@utils/fieldValidation";
import { expectFieldDefault, expectFieldError } from "@utils/uiMatchers";

const numberInputForbiddenPatterns = ["aaaaaaaaa", "!@#$%", " "];

test.describe(
	"“Create Unit” page | The “Contacts” tab (filled account)",
	{
		annotation: [
			{ type: "Testing page", description: "«Створення оголошення»" },
			{ type: "Path to page", description: ENDPOINTS.CREATE_UNIT },
		],
	},
	() => {
		test(
			"Verify contact card block, with filled personal info account",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C536" },
			},
			async ({ createUnitPageWithFilledFourTabs: _, verifiedUserContactsComponent: contacts }) => {
				await test.step("The title contains “Ваші контакти” text", async () => {
					await expect(contacts.yourContactsTitle).toBeVisible();
					await expect(contacts.yourContactsTitle).toContainText(tabs.contacts.yourContactsLabel);
				});

				await test.step("Contact card has valid data: ⤵️", async () => {
					await test.step("• Full name", async () => {
						await expect(contacts.userNameText).toContainText(`${env.user.firstName} ${env.user.lastName}`);
					});
					await test.step("• The “РНОКПП (ІПН)” data", async () => {
						await expect(contacts.tinText).toContainText(tabs.contacts.tinLabel);
					});
					await test.step("• Phone", async () => {
						await expect(contacts.userPhoneText).toContainText(`${env.user.phone}`);
					});
					await test.step("• Email", async () => {
						await expect(contacts.userEmailText).toContainText(`${env.user.email}`);
					});
				});

				await test.step("User’s avatar is displayed", async () => {
					await expect(contacts.photoImg).toBeVisible();
				});
			},
		);

		test(
			"Verify operator section",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C537" },
			},
			async ({ createUnitPageWithFilledFourTabs: _, verifiedUserContactsComponent: contacts }) => {
				await test.step("The section’s title has the “Контакти оператора” text", async () => {
					await expect(contacts.contactsOfOperatorTitle).toContainText(tabs.contacts.contactsOfOperatorLabel);
				});

				await test.step("Check box is active and has the “Я оператор технічного засобу” text", async () => {
					await expect(contacts.isOperatorCheckbox).toBeChecked();
					await expect(contacts.operatorLabel).toContainText(tabs.contacts.iAmTheOperator);
				});

				await test.step("There is no any additional fields while the checkbox is checked", async () => {
					await expect(contacts.operatorSection).toHaveCount(0);
				});

				const operatorFields: FieldData[] = [
					{
						label: contacts.operatorLastNameLabel,
						input: contacts.operatorLastNameInput,
						error: contacts.operatorLastNameInputErrorText,
						labelText: tabs.contacts.lastNameLabel,
					},
					{
						label: contacts.operatorFirstNameLabel,
						input: contacts.operatorFirstNameInput,
						error: contacts.operatorFirstNameInputErrorText,
						labelText: tabs.contacts.operatorFirstNameLabel,
					},
					{
						label: contacts.operatorPhoneLabel,
						input: contacts.operatorPhoneInput,
						error: contacts.operatorPhoneInputErrorText,
						labelText: tabs.contacts.operatorPhoneLabel,
					},
				];

				const operatorNameFields: FieldData[] = [operatorFields[0], operatorFields[1]];

				await test.step("Additional fields appear after unchecked the checkbox", async () => {
					await contacts.uncheckAsOperator();
					for (const field of operatorFields) await expect(field.input).toBeVisible();
				});

				await test.step("UI validating of fields: ⤵️", async () => {
					for (const field of operatorFields)
						await test.step(`• field’s title is “${field.labelText}”`, async () => {
							await expect(field.label).toContainText(field.labelText);
						});

					await test.step("• fields’ labels contain the asterisks", async () => {
						for (const field of operatorFields) await expect(field.label).toContainText(/\*$/);
					});

					await test.step("• fields are empty by default", async () => {
						for (const field of operatorFields) await expect(field.input).toHaveText("");
					});

					await test.step("• fields have red borders", async () => {
						for (const field of operatorFields) await expectFieldError(field.input);
					});

					await test.step("• clue lines have correct text", async () => {
						for (const field of operatorFields) await expect(field.error).toHaveText(FIELDS_ERRORS.EMPTY);
					});
				});

				await test.step("After clicking on the checkbox, the fields are disappear", async () => {
					await contacts.checkAsOperator();
					for (const field of operatorFields) await expect(field.input).toHaveCount(0);
				});

				await test.step("After clicking on the checkbox label, the fields are appear", async () => {
					await contacts.uncheckAsOperator(contacts.operatorLabel);
					for (const field of operatorFields) await expect(field.input).toBeVisible();
				});

				await test.step("Validate “Прізвище” and “Ім’я” inputs: ⤵️", async () => {
					await test.step("• The fields cannot contain less than 2 characters", async () => {
						for (const field of operatorNameFields) {
							await validateFieldByBothMethods(contacts, field, "a", async () => {
								await expectFieldError(field.input);
								await expect(field.error).toContainText(tabs.contacts.operatorNameErrors.less2);
							});
						}
					});

					await test.step("• The fields cannot contain more than 25 characters", async () => {
						for (const field of operatorNameFields) {
							await validateFieldByBothMethods(contacts, field, "a".repeat(26), async () => {
								await expectFieldError(field.input);
								await expect(field.error).toContainText(tabs.contacts.operatorNameErrors.more25);
							});
						}
					});

					await test.step("• The fields cannot contain spec. symbols, digits and spaces", async () => {
						for (const field of operatorNameFields)
							for (const pattern of ["123456", "!@#$%", " "])
								await validateFieldByBothMethods(contacts, field, pattern, async () => {
									await expect(field.input).toHaveValue(pattern);
									await expectFieldError(field.input);
									await expect(field.error).toContainText(tabs.contacts.namesErrors.lettersOnly);
								});
					});

					await test.step("• The fields can contain 2–25 letters/dashes", async () => {
						for (const field of operatorNameFields) {
							const validValues = ["a".repeat(2), "г".repeat(3), "a".repeat(25), "aa-aa"];
							for (const value of validValues) {
								await validateFieldByBothMethods(contacts, field, value, async () => {
									await expectFieldDefault(field.input);
									await expect(field.error).toHaveCount(0);
								});
							}
						}
					});
				});

				await test.step("Validate phone input: ⤵️", async () => {
					const field = operatorFields[operatorFields.length - 1];
					const code = "+380";

					await test.step("• the number cannot contain less than 9 significant digits", async () => {
						await validateTypeIntoField(contacts, field, "93", async () => {
							await expectFieldError(field.input);
							await expect(field.input).toHaveValue(`${code} 93`);
						});
					});

					await test.step("• the number cannot contain more than 9 significant digits", async () => {
						await validateTypeIntoField(contacts, field, "9312345678", async () => {
							await expectFieldDefault(field.input);
							await expect(field.input).toHaveValue(`${code} 93 123 4567`);
						});
					});

					await test.step("• the number cannot accept letters, special symbols and spaces", async () => {
						for (const pattern of numberInputForbiddenPatterns) {
							await validateTypeIntoField(contacts, field, pattern, async () => {
								await expectFieldError(field.input);
								await expect(field.input).toHaveValue("+380");
							});
						}
					});

					await test.step("• the number can contain 9 significant digits with correct operator’s codes", async () => {
						for (const code of CODES) {
							await validateTypeIntoField(contacts, field, code + "1234567", async () => {
								await expectFieldDefault(field.input);
								await expect(field.input).toHaveValue("+380 " + code + " 123 4567");
								await expect(field.error).toHaveCount(0);
							});
						}
					});
				});
			},
		);
	},
);

test.describe(
	"“Create Unit” page | The “Contacts” tab (unfilled account)",
	{
		annotation: [
			{ type: "Testing page", description: "«Створення оголошення»" },
			{ type: "Path to page", description: ENDPOINTS.CREATE_UNIT },
		],
	},
	() => {
		test(
			"Verify “customer type” section, with unfilled personal info account",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C492" },
			},
			async ({
				createUnitPageWithFilledFourTabsNewUser: _,
				newUserContactsComponent: contacts,
				newUserPage: page,
			}) => {
				await test.step("Verify the title of customer type: ⤵️", async () => {
					await test.step("• it’s visible", async () => {
						await expect(contacts.customerTypeLabel).toBeVisible();
					});

					await test.step("• it has the correct text", async () => {
						await expect(contacts.customerTypeLabel).toContainText(tabs.contacts.userTypeLabel);
					});

					await test.step("• it has the asterisk (required field)", async () => {
						await expect(contacts.customerTypeLabel).toContainText(/\*$/);
					});
				});

				await test.step("The “Приватна особа” option is choosed by default", async () => {
					await expect(contacts.customerTypeDropdown).toHaveText(tabs.contacts.userTypes.private);
				});

				await test.step("Verify the “РНОКПП (ІПН)” section: ⤵️", async () => {
					await test.step("• the title is visible", async () => {
						await expect(contacts.customerTinLabel).toBeVisible();
					});

					await test.step("• the title contains the “РНОКПП (ІПН)” text", async () => {
						await expect(contacts.customerTinLabel).toContainText(tabs.contacts.tinLabel);
					});

					await test.step("• the field is empty by default", async () => {
						await expect(contacts.customerTinInput).toHaveValue("");
					});

					await test.step("• the clue line has the correct text", async () => {
						await expect(contacts.customerTinDescription).toContainText(tabs.contacts.tinDescription);
					});
				});

				const customerTypes = Object.values(tabs.contacts.userTypes);

				await test.step("After clicking on the dropdown, the list of types appears", async () => {
					await contacts.openCustomerTypeDropdown();
					await expect(contacts.customerTypeListContainer).toBeVisible();
					const dropdownItems = await contacts.customerTypeListItems.allTextContents();

					expect(dropdownItems.every((item, i) => item === customerTypes[i])).toBeTruthy();
				});

				const createUnitPage = new CreateUnitPage(page);

				const fopField: FieldData = {
					input: contacts.customerTinInput,
					label: contacts.customerTinLabel,
					error: contacts.customerTinInputErrorText,
					labelText: tabs.contacts.userTypes.fop,
				};

				await test.step("Checking UI when selecting “ФОП”: ⤵️", async () => {
					await contacts.openCustomerTypeDropdown();
					await contacts.chooseCustomerType(fopField.labelText);

					await test.step("• the field of number has the “РНОКПП (ІПН) для ФОП” label", async () => {
						await expect(fopField.label).toContainText(
							`${tabs.contacts.tinLabel} для ${fopField.labelText}`,
						);
					});

					await test.step("• it cannot be empty", async () => {
						await createUnitPage.nextStep();
						await expect(contacts.customerTinInputErrorText).toBeVisible();
						await expect(contacts.customerTinInputErrorText).toContainText(FIELDS_ERRORS.EMPTY);
					});
				});

				await test.step("Verify the “РНОКПП (ІПН) для ФОП” input: ⤵️", async () => {
					await test.step("• it cannot have less than 10 digits", async () => {
						await validateFieldByBothMethods(contacts, fopField, "123456789", async () => {
							await createUnitPage.nextStep();
							await expect(fopField.input).toHaveValue("123456789");
							await expectFieldError(fopField.input);
							await expect(fopField.error).toHaveText(tabs.contacts.tinInputErrorText);
						});
					});

					await test.step("• it cannot have more than 10 digits", async () => {
						await validateFieldByBothMethods(contacts, fopField, "12345678901", async () => {
							await createUnitPage.nextStep();
							await expect(fopField.input).toHaveValue("1234567890");
							await expectFieldDefault(fopField.input);
							await expect(fopField.error).toHaveCount(0);
						});
					});

					await test.step("• it cannot have letters, specical symbols and spaces", async () => {
						for (const pattern of numberInputForbiddenPatterns) {
							await validateFieldByBothMethods(contacts, fopField, pattern, async () => {
								await createUnitPage.nextStep();

								await expect(fopField.input).toHaveValue("");
								await expectFieldError(fopField.input);
								await expect(fopField.error).toHaveText(FIELDS_ERRORS.EMPTY);
							});
						}
					});
				});

				const privateField: FieldData = {
					input: contacts.customerTinInput,
					label: contacts.customerTinLabel,
					error: contacts.customerTinInputErrorText,
					labelText: tabs.contacts.userTypes.fop,
				};

				await test.step("Checking UI when selecting “Приватна особа”: ⤵️", async () => {
					await contacts.openCustomerTypeDropdown();
					await contacts.chooseCustomerType(tabs.contacts.userTypes.private);
					await test.step("• the field of number has the “РНОКПП (ІПН)” label", async () => {
						await expect(contacts.customerTinLabel).toContainText(tabs.contacts.tinLabel);
					});
				});

				await test.step("Verify the “РНОКПП (ІПН)” input: ⤵️", async () => {
					await test.step("• it cannot have less than 10 digits", async () => {
						await validateFieldByBothMethods(contacts, privateField, "123456789", async () => {
							await createUnitPage.nextStep();
							await expect(privateField.input).toHaveValue("123456789");
							await expectFieldError(privateField.input);
							await expect(privateField.error).toHaveText(tabs.contacts.tinInputErrorText);
						});
					});

					await test.step("• it cannot have more than 10 digits", async () => {
						await validateFieldByBothMethods(contacts, privateField, "12345678901", async () => {
							await createUnitPage.nextStep();
							await expect(privateField.input).toHaveValue("1234567890");
							await expectFieldDefault(privateField.input);
							await expect(privateField.error).toHaveCount(0);
						});
					});

					await test.step("• it cannot have letters, specical symbols and spaces", async () => {
						for (const pattern of numberInputForbiddenPatterns) {
							await validateFieldByBothMethods(contacts, privateField, pattern, async () => {
								await createUnitPage.nextStep();

								await expect(privateField.input).toHaveValue("");
							});
						}
					});
				});

				const legalFields = [
					{
						input: contacts.legalNumberInput,
						error: contacts.legalNumberError,
						label: contacts.legalNumberLabel,
						labelText: tabs.contacts.legalNumberLabel,
					},
					{
						input: contacts.legalNameInput,
						error: contacts.legalNameError,
						label: contacts.legalNameLabel,
						labelText: tabs.contacts.legalNameLabel,
					},
				];

				await test.step("Checking UI when selecting “Юридична особа”: ⤵️", async () => {
					await contacts.openCustomerTypeDropdown();
					await contacts.chooseCustomerType(tabs.contacts.userTypes.legal);

					await test.step("• the empty “Тип юридичної особи” field appears", async () => {
						await expect(contacts.legalTypeDropdownLabel).toBeVisible();
						await expect(contacts.legalTypeDropdownLabel).toContainText(tabs.contacts.legalTypeLabel);
						await expect(contacts.legalTypeDropdown).toHaveText("");
					});

					await test.step("• the empty “ЄДРПОУ для юридичних осіб” field appears", async () => {
						await expect(contacts.legalNumberLabel).toBeVisible();
						await expect(contacts.legalNumberLabel).toContainText(tabs.contacts.legalNumberLabel);
						await expect(contacts.legalNumberInput).toHaveValue("");
					});

					await test.step("• the empty “Назва юридичної особи” field appears", async () => {
						await expect(contacts.legalNameLabel).toBeVisible();
						await expect(contacts.legalNameLabel).toContainText(tabs.contacts.legalNameLabel);
						await expect(contacts.legalNameInput).toHaveValue("");
					});
				});

				await test.step("The “Тип юридичної особи” dropdown accept all its items", async () => {
					const types = Object.values(tabs.contacts.legalTypes);
					for (const type of types) {
						await contacts.openLegalTypeDropdown();
						await contacts.chooseLegalType(type);
						await expect(contacts.legalTypeDropdown, `“${type}” in the dropdown |`).toContainText(type);
					}
				});

				await test.step("Verify the “ЄДРПОУ для юридичних осіб” field", async () => {
					await test.step("• it cannot have less then 8 digits", async () => {
						await validateFieldByBothMethods(contacts, legalFields[0], "1234567", async () => {
							await createUnitPage.nextStep();
							await expect(legalFields[0].input).toHaveValue("1234567");
							await expectFieldError(legalFields[0].input);
							await expect(legalFields[0].error).toContainText(tabs.contacts.legalNumberErrorText);
						});
					});

					await test.step("• it cannot have more than 8 digits", async () => {
						await validateTypeIntoField(contacts, legalFields[0], "123456789", async () => {
							await createUnitPage.nextStep();

							await expect(legalFields[0].input).toHaveValue("12345678");
							await expectFieldDefault(legalFields[0].input);
						});
						await validateFillInField(contacts, legalFields[0], "123456789", async () => {
							await createUnitPage.nextStep();

							await expect(legalFields[0].input).toHaveValue("");
							await expectFieldError(legalFields[0].input);
						});
					});

					await test.step("• it can have only digits", async () => {
						for (const pattern of numberInputForbiddenPatterns) {
							await validateFieldByBothMethods(contacts, legalFields[0], pattern, async () => {
								await createUnitPage.nextStep();

								await expect(legalFields[0].input).toHaveValue("");
							});
						}
					});

					await test.step("• it cannot have a space as a part of the number", async () => {
						for (const badPattern of ["12345 67", "1234567 "]) {
							await validateTypeIntoField(contacts, legalFields[0], badPattern, async () => {
								await createUnitPage.nextStep();
								await expect(legalFields[0].input).toHaveValue("1234567");
								await expectFieldError(legalFields[0].input);
								await expect(legalFields[0].error).toContainText(tabs.contacts.legalNumberErrorText);
							});

							await validateFillInField(contacts, legalFields[0], badPattern, async () => {
								await createUnitPage.nextStep();
								await expect(legalFields[0].input).toHaveValue("");
								await expect(legalFields[0].error).toContainText(FIELDS_ERRORS.EMPTY);
							});
						}
					});
				});

				await test.step("Verify the “Назва юридичної особи” field", async () => {
					await test.step("• it can have less 26 letters / digits / allowed spec. symbols", async () => {
						for (const pattern of [
							"12345678901234567890123456",
							"aaaaaaaaaaaaaaaaaaaaaaaaaa",
							"12-!@ Corp. Щастя ",
						])
							await validateFieldByBothMethods(contacts, legalFields[1], pattern, async () => {
								await createUnitPage.nextStep();
								await expectFieldDefault(legalFields[1].input);
								await expect(legalFields[1].input).toHaveValue(pattern.slice(0, 25));
								await expect(legalFields[1].error).toHaveCount(0);
							});
					});

					await test.step("• it cannot have these symbols: <>{};^", async () => {
						await validateFieldByBothMethods(contacts, legalFields[1], "<>{};^", async () => {
							await createUnitPage.nextStep();
							await expectFieldError(legalFields[1].input);
							await expect(legalFields[1].input).toHaveValue("");
						});
					});

					await test.step("• it cannot have spaces only", async () => {
						await validateFieldByBothMethods(contacts, legalFields[1], " ", async () => {
							await createUnitPage.nextStep();
							await expect(legalFields[1].input).toHaveValue("");
							await expectFieldError(legalFields[1].input);
							await expect(legalFields[1].error).toContainText(FIELDS_ERRORS.EMPTY);
						});
					});
				});
			},
		);

		test(
			"Verify name section, with unfilled personal info account",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C529" },
			},
			async ({ createUnitPageWithFilledFourTabsNewUser: createUnitPage, newUserContactsComponent: contacts }) => {
				const customerNamesFields: FieldData[] = [
					{
						input: contacts.customerLastNameInput,
						error: contacts.customerLastNameError,
						label: contacts.customerLastNameLabel,
						labelText: tabs.contacts.lastNameLabel,
					},
					{
						input: contacts.customerFirstNameInput,
						error: contacts.customerFirstNameError,
						label: contacts.customerFirstNameLabel,
						labelText: tabs.contacts.firstNameLabel,
					},
					{
						input: contacts.customerPatronymicInput,
						error: contacts.customerPatronymicError,
						label: contacts.customerPatronymicLabel,
						labelText: tabs.contacts.patronymicLabel,
					},
				];

				for (const field of customerNamesFields) {
					let isRequired: boolean;

					await test.step(`* Setting the required status of the “${field.labelText}” field`, async () => {
						isRequired = await contacts.isRequired(field.label);
					});

					await test.step(`UI checking of “${field.labelText}” section`, async () => {
						await createUnitPage.nextStep();

						await test.step(`• the label of section is “${field.labelText} ${isRequired ? "*" : ""}”`, async () => {
							await expect(field.label).toHaveText(`${field.labelText} ${isRequired ? "*" : ""}`);
						});

						await test.step("• the field is empty by default", async () => {
							await expect(field.input).toHaveValue("");
						});

						if (isRequired) {
							await test.step("• the field’s border is red", async () => {
								await expectFieldError(field.input);
							});

							await test.step("• the error message is visible", async () => {
								await expect(field.error).toHaveText(FIELDS_ERRORS.EMPTY);
							});
						}
					});

					await test.step(`Verify the “${field.labelText}” field`, async () => {
						await test.step("• it should have at least 2 letters", async () => {
							await validateFieldByBothMethods(contacts, field, "A", async () => {
								await createUnitPage.nextStep();

								await expect(field.input).toHaveValue("A");
								await expect(field.error).toHaveText(
									`${field.labelText} ${tabs.contacts.namesErrors.less2}`,
								);
								await expectFieldError(field.input);
							});
						});

						await test.step("• it shouldn’t have more than 25 letters", async () => {
							const pattern = "B".repeat(26);

							await validateFieldByBothMethods(contacts, field, pattern, async () => {
								await createUnitPage.nextStep();

								await expectFieldDefault(field.input);
								await expect(field.input).toHaveValue(new RegExp(pattern.slice(0, 25)));
							});
						});

						await test.step("• it shouldn’t have numbers", async () => {
							const pattern = "12345";

							await validateFieldByBothMethods(contacts, field, pattern, async () => {
								await createUnitPage.nextStep();

								await expectFieldError(field.input);
								await expect(field.input).toHaveValue(pattern);
								await expect(field.error).toHaveText(
									`${field.labelText} ${tabs.contacts.namesErrors.lettersOnly}`,
								);
							});
						});

						await test.step("• it can have only allowed spec. symbols: !@#$%", async () => {
							const allowedSymbols = "!@#$%";
							const deniedSymbols = "<>{};^";

							await validateFieldByBothMethods(
								contacts,
								field,
								allowedSymbols + deniedSymbols,
								async () => {
									await createUnitPage.nextStep();

									await expect(field.input).toHaveValue(allowedSymbols);
									await expectFieldError(field.input);
									await expect(field.error).toHaveText(
										`${field.labelText} ${tabs.contacts.namesErrors.lettersOnly}`,
									);
								},
							);
						});

						await test.step("• it cannot have spaces only", async () => {
							if (isRequired)
								await validateFieldByBothMethods(contacts, field, " ", async () => {
									await createUnitPage.nextStep();

									await expect(field.input).toHaveValue("");
									await expectFieldError(field.input);
									await expect(field.error).toHaveText(FIELDS_ERRORS.EMPTY);
								});
						});

						await test.step("• it cannot have spaces in the names", async () => {
							for (const pattern of ["AAA BBB", "AAABBB "])
								await validateFieldByBothMethods(contacts, field, pattern, async () => {
									await createUnitPage.nextStep();

									await expect(field.input).toHaveValue(pattern);
									await expectFieldError(field.input);
									await expect(field.error).toHaveText(
										`${field.labelText} ${tabs.contacts.namesErrors.lettersOnly}`,
									);
								});
						});

						await test.step("• the error disappear when filling the correct strings", async () => {
							for (const pattern of ["aa", "aa-aa", "абвгд"])
								await validateFieldByBothMethods(contacts, field, pattern, async () => {
									await createUnitPage.nextStep();

									await expect(field.input).toHaveValue(pattern.capitalize());
									await expectFieldDefault(field.input);
									await expect(field.error).toHaveCount(0);
								});
						});
					});
				}
			},
		);

		test(
			"Verify “Номер телефону” and email sections, with unfilled personal info account (account registrated using email)",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C547" },
			},
			async ({ createUnitPageWithFilledFourTabsNewUser: _, newUserContactsComponent: contacts }) => {
				await test.step("The input is empty by default", async () => {
					await expect(contacts.phoneNumberInput).toHaveValue("");
				});

				await test.step("The input title is visible", async () => {
					await expect(contacts.phoneNumberInputLabel).toBeVisible();
				});

				await test.step("The input title has the “Номер телефону *” text", async () => {
					await expect(contacts.phoneNumberInputLabel).toHaveText(tabs.contacts.userPhoneLabel + " *");
				});
			},
		);
	},
);
