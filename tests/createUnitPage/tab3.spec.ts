import { test, expect } from "@fixtures/indexV2";
import endpoints from "@constants/endpoints.constants.json";
import { SELECT_ICON, SELECTED_ICON, tabs } from "@constants/create-unit/fields.constants";
import { getFieldPlaceholder } from "@utils/formHelper";
import {
	BUTTONS,
	createUnitConsts as data,
	FORBIDDEN_SYMBOLS,
	TAB_NUMBERS,
	TAB_TITLES,
} from "@constants/create-unit/createUnit.constants";
import { generateText } from "@utils/fakeData";
import { SERVICES } from "@constants/catalog.constants";
import { formatMissingServiceError } from "@utils/formatErrorMessages";
import { clickElement } from "@utils/clickers";
import { expectTabActive, expectTabInactive, expectTextColorError } from "@utils/uiMatchers";
import { getTwoRandomIndices } from "@utils/getRandomIndices";

test.describe(
	"“Create unit” page | The “Service” tab",
	{
		annotation: [
			{ type: "Testing page", description: "«Створення оголошення»" },
			{ type: "Path to page", description: endpoints["create unit"] },
		],
	},
	() => {
		test(
			"Verify input section and choosing of existing sevice",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C409" },
			},
			async ({ createUnitPageWithFilledTwoTabs: page }) => {
				const serviceTitle = SERVICES.subcategories["construction services"].subcategories.drilling.title;

				await test.step("The title: ⤵️", async () => {
					await test.step("• is visible", async () => {
						await expect(page.serviceTab.description).toBeVisible();
					});

					await test.step(`• has the “${tabs.service.description}” text`, async () => {
						await expect(page.serviceTab.description).toContainText(tabs.service.description);
					});

					await test.step("• has an asterisk", async () => {
						await expect(page.serviceTab.requiredSymbol).toBeVisible();
					});
				});

				await test.step("Clue line has the correct text", async () => {
					await expect(page.serviceTab.addInfo).toContainText(tabs.service.addInfo);
				});

				await test.step("Loupe icon is: ⤵️", async () => {
					await test.step("• visible", async () => {
						await expect(page.serviceTab.loupeIcon).toBeVisible();
					});

					await test.step("• located on the left side of the field", async () => {
						const loupeBox = await page.serviceTab.getLoupeCoords();
						const fieldBox = await page.serviceTab.getFieldCoords();
						expect(loupeBox!.x).toBeLessThan(fieldBox!.x);
					});
				});

				await test.step("Input field background has the valid text", async () => {
					expect(await getFieldPlaceholder(page.serviceTab.field)).toContain(tabs.service.placeholder);
				});

				await test.step(`Input field cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
					await page.serviceTab.typeService(FORBIDDEN_SYMBOLS);
					await expect(page.serviceTab.field).toHaveValue("");
					await page.serviceTab.fillField(FORBIDDEN_SYMBOLS);
					await expect(page.serviceTab.field).toHaveValue("");
				});

				await test.step("The limit of string’s length is 100 symbols", async () => {
					const serviceName = generateText(101);
					await page.serviceTab.typeService(serviceName);
					expect(page.serviceTab.field).toHaveValue(serviceName.slice(0, serviceName.length - 1));

					await page.serviceTab.clearField();
					await page.serviceTab.fillField(serviceName);
					expect(page.serviceTab.field).toHaveValue(serviceName.slice(0, serviceName.length - 1));
				});

				await test.step("Dropdown is appeared after typing of one symbol", async () => {
					await page.serviceTab.clearField();
					await page.serviceTab.typeService("Б");
					await expect(page.serviceTab.searchResultsContainer).toBeVisible();
				});

				await test.step("Dropdown shows the correct result regardless of the case of characters", async () => {
					const testWords = [serviceTitle.toLowerCase(), serviceTitle.toUpperCase()];
					let baseResults: string[] | null = null;

					for (const word of testWords) {
						await page.serviceTab.clearField();
						await page.serviceTab.typeService(word);

						await page.serviceTab.searchResultsContainer.waitFor({
							state: "visible",
						});

						const currentResults = await page.serviceTab.searchResults.allTextContents();

						if (!baseResults) baseResults = currentResults;
						else expect(currentResults).toEqual(baseResults);
					}
				});

				await test.step("After clicking on variant from dropdown “selected” mark appears in dropdown", async () => {
					const firstResult = page.serviceTab.searchResults.first();
					await expect(page.serviceTab.getPathElement(firstResult)).toHaveAttribute("d", SELECT_ICON);

					await page.serviceTab.selectService();
					await expect(page.serviceTab.getPathElement(firstResult)).toHaveAttribute("d", SELECTED_ICON);
				});

				await test.step("The “Selected services” section: ⤵️", async () => {
					await test.step("• has the correct title", async () => {
						await expect(page.serviceTab.selectedServicesSectionTitle).toContainText(
							tabs.service.addedServicesTitle,
						);
					});

					await test.step("• is visible", async () => {
						await expect(page.serviceTab.selectedServicesSectionTitle).toBeVisible();
						await expect(page.serviceTab.selectedServicesSection).toBeVisible();
					});

					await test.step("• has the selected service", async () => {
						await expect(page.serviceTab.selectedServices.first()).toHaveText(serviceTitle);
					});
				});

				await test.step("The attached service has a remove icon", async () => {
					await expect(page.serviceTab.getRemoveIcon(page.serviceTab.selectedServices.first())).toBeVisible();
				});
			},
		);

		test(
			"Verify creating new service",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C410" },
			},
			async ({ createUnitPageWithFilledTwoTabsAndNewService: page }) => {
				const { createUnitPage, service: newService } = page;

				await test.step("Filling a field with a non-existent service", async () => {
					await createUnitPage.serviceTab.fillField(newService);
					await expect(createUnitPage.serviceTab.field).toHaveValue(newService);
				});

				await test.step("The dropdown: ⤵️", async () => {
					await test.step("• shows valid reaction with notification text", async () => {
						await expect(createUnitPage.serviceTab.notFoundServiceText).toBeVisible();
					});

					await test.step("• shows the “Створити послугу” button", async () => {
						await expect(createUnitPage.serviceTab.addServiceButton).toBeVisible();
					});

					await test.step("• has the valid warning text", async () => {
						await expect(createUnitPage.serviceTab.notFoundServiceText).toContainText(
							formatMissingServiceError(newService),
						);
					});
				});

				await test.step("Creating service button has: ⤵️", async () => {
					await test.step("• the correct name", async () => {
						await expect(createUnitPage.serviceTab.addServiceButton).toContainText(
							tabs.service.addServiceButtonText,
						);
					});

					await test.step("• the icon", async () => {
						await expect(createUnitPage.serviceTab.addServiceIcon).toBeVisible();
					});
				});

				await test.step("After clicking the button: ⤵️", async () => {
					await clickElement(createUnitPage.serviceTab.addServiceButton);
					await createUnitPage.serviceTab.selectedServices.first().waitFor({ state: "visible" });

					await test.step("• the service is selected", async () => {
						await expect(createUnitPage.serviceTab.selectedServices.first()).toHaveText(newService);
					});

					await test.step("• the category is appeared as existing", async () => {
						await expect(
							createUnitPage.serviceTab.getPathElement(createUnitPage.serviceTab.searchResults.first()),
						).toHaveAttribute("d", SELECTED_ICON);
					});
				});
			},
		);

		test(
			"Verify choosing multiple services",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C411" },
			},
			async ({ createUnitPageWithFilledTwoTabs: page }) => {
				const letter = "Г";
				let allResults: string[] = [];
				const chosenResults: string[] = [];

				await test.step("It should show search results with inputed letter", async () => {
					await page.serviceTab.typeService(letter);

					allResults = await page.serviceTab.searchResults.allTextContents();

					expect(allResults.every((service) => service.toUpperCase().includes(letter))).toBeTruthy();
				});

				await test.step("After clicking on a variant: ⤵️", async () => {
					const { first: firstRandomIndex, second: secondRandomIndex } = getTwoRandomIndices(
						allResults.length,
					);

					await test.step("• it becomes marked as selected", async () => {
						await page.serviceTab.selectService(firstRandomIndex);
						await expect(
							page.serviceTab.getPathElement(page.serviceTab.searchResults.nth(firstRandomIndex)),
						).toHaveAttribute("d", SELECTED_ICON);

						chosenResults.push(
							(await page.serviceTab.searchResults.nth(firstRandomIndex).textContent()) ?? "",
						);

						if (secondRandomIndex) {
							await page.serviceTab.selectService(secondRandomIndex);
							await expect(
								page.serviceTab.getPathElement(page.serviceTab.searchResults.nth(secondRandomIndex)),
							).toHaveAttribute("d", SELECTED_ICON);
							chosenResults.push(
								(await page.serviceTab.searchResults.nth(secondRandomIndex).textContent()) ?? "",
							);
						}
					});

					await test.step("• it gets into the list of selected services", async () => {
						const pinnedServices = await page.serviceTab.selectedServices.allTextContents();

						expect(chosenResults.every((service) => pinnedServices.includes(service))).toBeTruthy();
					});
				});
			},
		);

		test(
			"Verify removing variants from chosen list",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C412" },
			},
			async ({ createUnitPageWithFilledTwoTabs: page }) => {
				// Select two services
				await page.serviceTab.typeService("Г");
				await page.serviceTab.searchResultsContainer.waitFor({
					state: "visible",
				});
				await page.serviceTab.selectService(0);
				await page.serviceTab.selectService(1);

				await test.step("After clicking the delete button, the service is unlinked from the ad", async () => {
					while ((await page.serviceTab.selectedServices.count()) > 0) {
						const removingService = await page.serviceTab.selectedServices.last().textContent();
						await page.serviceTab.getRemoveIcon(page.serviceTab.selectedServices.last()).click();
						const remainingServices = await page.serviceTab.selectedServices.allTextContents();
						expect(remainingServices.includes(removingService!)).toBeFalsy();
					}
				});

				await test.step(`After deleting the last service, the “${tabs.service.addedServicesTitle}” panel disappears.`, async () => {
					await expect(page.serviceTab.selectedServicesSection).toBeHidden();
				});
			},
		);

		test(
			`Verify “Назад” button`,
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C413" },
			},
			async ({ createUnitPageWithFilledTwoTabs: page }) => {
				await test.step("The button has the correct text", async () => {
					await expect(page.cancelButton).toHaveText(BUTTONS.BACK);
				});
				await test.step(`The user is redirected to the previous tab after clicking the “Назад” button`, async () => {
					await page.previousStep();
					await expectTabActive(page.tabList.nth(1));
					for (let i = 0; i < TAB_NUMBERS.length; i++) {
						if (i === 1) continue;
						await expectTabInactive(page.tabList.nth(i));
					}
				});

				await test.step("The data in the second tab is saved", async () => {
					expect(await page.photosTab.uploadedPhotoButtons.count()).toBeGreaterThanOrEqual(1);
				});
			},
		);

		test(
			`Verify “Далі” button`,
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C414" },
			},
			async ({ createUnitPageWithFilledTwoTabs: page }) => {
				await test.step("The button has the correct text", async () => {
					await expect(page.nextButton).toHaveText(BUTTONS.NEXT);
				});

				await test.step("After clicking the «Далі» button the color of the clue line is red if user didn’t set any service", async () => {
					await page.nextStep();
					await expectTextColorError(page.serviceTab.addInfo);
				});

				await test.step("The user can proceed to the next tab after setting at least one service", async () => {
					await page.serviceTab.fillField("Г");
					await page.serviceTab.selectService();

					await page.nextStep();

					await expectTabActive(page.tabList.nth(3));

					await expect(page.pageTitle).toBeVisible();
					await expect(page.pageTitle).toHaveText(data.pageTitle);
				});

				await test.step("Other tabs are inactive and unchanged", async () => {
					for (let i = 0; i < TAB_NUMBERS.length; i++) {
						if (i === 3) continue;

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
