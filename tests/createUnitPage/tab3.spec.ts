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
			async ({ createUnitPageWithFilledTwoTabs: _, serviceComponent: service }) => {
				const serviceTitle = SERVICES.subcategories["construction services"].subcategories.drilling.title;

				await test.step("The title: ⤵️", async () => {
					await test.step("• is visible", async () => {
						await expect(service.description).toBeVisible();
					});

					await test.step(`• has the “${tabs.service.description}” text`, async () => {
						await expect(service.description).toContainText(tabs.service.description);
					});

					await test.step("• has an asterisk", async () => {
						await expect(service.requiredSymbol).toBeVisible();
					});
				});

				await test.step("Clue line has the correct text", async () => {
					await expect(service.addInfo).toContainText(tabs.service.addInfo);
				});

				await test.step("Loupe icon is: ⤵️", async () => {
					await test.step("• visible", async () => {
						await expect(service.loupeIcon).toBeVisible();
					});

					await test.step("• located on the left side of the field", async () => {
						const loupeBox = await service.getLoupeCoords();
						const fieldBox = await service.getFieldCoords();
						expect(loupeBox!.x).toBeLessThan(fieldBox!.x);
					});
				});

				await test.step("Input field background has the valid text", async () => {
					expect(await getFieldPlaceholder(service.field)).toContain(tabs.service.placeholder);
				});

				await test.step(`Input field cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
					await service.typeService(FORBIDDEN_SYMBOLS);
					await expect(service.field).toHaveValue("");
					await service.fillField(FORBIDDEN_SYMBOLS);
					await expect(service.field).toHaveValue("");
				});

				await test.step("The limit of string’s length is 100 symbols", async () => {
					const serviceName = generateText(101);
					await service.typeService(serviceName);
					expect(service.field).toHaveValue(serviceName.slice(0, serviceName.length - 1));

					await service.clearField();
					await service.fillField(serviceName);
					expect(service.field).toHaveValue(serviceName.slice(0, serviceName.length - 1));
				});

				await test.step("Dropdown is appeared after typing of one symbol", async () => {
					await service.clearField();
					await service.typeService("Б");
					await expect(service.searchResultsContainer).toBeVisible();
				});

				await test.step("Dropdown shows the correct result regardless of the case of characters", async () => {
					const testWords = [serviceTitle.toLowerCase(), serviceTitle.toUpperCase()];
					let baseResults: string[] | null = null;

					for (const word of testWords) {
						await service.clearField();
						await service.typeService(word);

						await service.searchResultsContainer.waitFor({
							state: "visible",
						});

						const currentResults = await service.searchResults.allTextContents();

						if (!baseResults) baseResults = currentResults;
						else expect(currentResults).toEqual(baseResults);
					}
				});

				await test.step("After clicking on variant from dropdown “selected” mark appears in dropdown", async () => {
					const firstResult = service.searchResults.first();
					await expect(service.getPathElement(firstResult)).toHaveAttribute("d", SELECT_ICON);

					await service.selectService();
					await expect(service.getPathElement(firstResult)).toHaveAttribute("d", SELECTED_ICON);
				});

				await test.step("The “Selected services” section: ⤵️", async () => {
					await test.step("• has the correct title", async () => {
						await expect(service.selectedServicesSectionTitle).toContainText(
							tabs.service.addedServicesTitle,
						);
					});

					await test.step("• is visible", async () => {
						await expect(service.selectedServicesSectionTitle).toBeVisible();
						await expect(service.selectedServicesSection).toBeVisible();
					});

					await test.step("• has the selected service", async () => {
						await expect(service.selectedServices.first()).toHaveText(serviceTitle);
					});
				});

				await test.step("The attached service has a remove icon", async () => {
					await expect(service.getRemoveIcon(service.selectedServices.first())).toBeVisible();
				});
			},
		);

		test(
			"Verify creating new service",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C410" },
			},
			async ({ createUnitPageWithFilledTwoTabsAndNewService: page, serviceComponent: service }) => {
				const { createUnitPage: _, service: newService } = page;

				await test.step("Filling a field with a non-existent service", async () => {
					await service.fillField(newService);
					await expect(service.field).toHaveValue(newService);
				});

				await test.step("The dropdown: ⤵️", async () => {
					await test.step("• shows valid reaction with notification text", async () => {
						await expect(service.notFoundServiceText).toBeVisible();
					});

					await test.step("• shows the “Створити послугу” button", async () => {
						await expect(service.addServiceButton).toBeVisible();
					});

					await test.step("• has the valid warning text", async () => {
						await expect(service.notFoundServiceText).toContainText(formatMissingServiceError(newService));
					});
				});

				await test.step("Creating service button has: ⤵️", async () => {
					await test.step("• the correct name", async () => {
						await expect(service.addServiceButton).toContainText(tabs.service.addServiceButtonText);
					});

					await test.step("• the icon", async () => {
						await expect(service.addServiceIcon).toBeVisible();
					});
				});

				await test.step("After clicking the button: ⤵️", async () => {
					await clickElement(service.addServiceButton);
					await service.selectedServices.first().waitFor({ state: "visible" });

					await test.step("• the service is selected", async () => {
						await expect(service.selectedServices.first()).toHaveText(newService);
					});

					await test.step("• the category is appeared as existing", async () => {
						await expect(service.getPathElement(service.searchResults.first())).toHaveAttribute(
							"d",
							SELECTED_ICON,
						);
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
			async ({ createUnitPageWithFilledTwoTabs: _, serviceComponent: service }) => {
				const letter = "Г";
				let allResults: string[] = [];
				const chosenResults: string[] = [];

				await test.step("It should show search results with inputed letter", async () => {
					await service.typeService(letter);

					allResults = await service.searchResults.allTextContents();

					expect(allResults.every((service) => service.toUpperCase().includes(letter))).toBeTruthy();
				});

				await test.step("After clicking on a variant: ⤵️", async () => {
					const { first: firstRandomIndex, second: secondRandomIndex } = getTwoRandomIndices(
						allResults.length,
					);

					await test.step("• it becomes marked as selected", async () => {
						await service.selectService(firstRandomIndex);
						await expect(
							service.getPathElement(service.searchResults.nth(firstRandomIndex)),
						).toHaveAttribute("d", SELECTED_ICON);

						chosenResults.push((await service.searchResults.nth(firstRandomIndex).textContent()) ?? "");

						if (secondRandomIndex) {
							await service.selectService(secondRandomIndex);
							await expect(
								service.getPathElement(service.searchResults.nth(secondRandomIndex)),
							).toHaveAttribute("d", SELECTED_ICON);
							chosenResults.push(
								(await service.searchResults.nth(secondRandomIndex).textContent()) ?? "",
							);
						}
					});

					await test.step("• it gets into the list of selected services", async () => {
						const pinnedServices = await service.selectedServices.allTextContents();

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
			async ({ createUnitPageWithFilledTwoTabs: _, serviceComponent: service }) => {
				// Select two services
				await service.typeService("Г");
				await service.searchResultsContainer.waitFor({
					state: "visible",
				});
				await service.selectService(0);
				await service.selectService(1);

				await test.step("After clicking the delete button, the service is unlinked from the ad", async () => {
					while ((await service.selectedServices.count()) > 0) {
						const removingService = await service.selectedServices.last().textContent();
						await service.getRemoveIcon(service.selectedServices.last()).click();
						const remainingServices = await service.selectedServices.allTextContents();
						expect(remainingServices.includes(removingService!)).toBeFalsy();
					}
				});

				await test.step(`After deleting the last service, the “${tabs.service.addedServicesTitle}” panel disappears.`, async () => {
					await expect(service.selectedServicesSection).toBeHidden();
				});
			},
		);

		test(
			`Verify “Назад” button`,
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C413" },
			},
			async ({ createUnitPageWithFilledTwoTabs: page, photosComponent: photos }) => {
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
					expect(await photos.uploadedPhotoButtons.count()).toBeGreaterThanOrEqual(1);
				});
			},
		);

		test(
			`Verify “Далі” button`,
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C414" },
			},
			async ({ createUnitPageWithFilledTwoTabs: page, serviceComponent: service }) => {
				await test.step("The button has the correct text", async () => {
					await expect(page.nextButton).toHaveText(BUTTONS.NEXT);
				});

				await test.step("After clicking the «Далі» button the color of the clue line is red if user didn’t set any service", async () => {
					await page.nextStep();
					await expectTextColorError(service.addInfo);
				});

				await test.step("The user can proceed to the next tab after setting at least one service", async () => {
					await service.fillField("Г");
					await service.selectService();

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
