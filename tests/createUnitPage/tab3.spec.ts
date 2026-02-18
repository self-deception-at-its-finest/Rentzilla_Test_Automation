import { test, expect } from "../../fixtures/index";
import endpoints from "../../constants/endpoints.constants.json";
import { tabsFields } from "../../constants/create-unit/fields.constants";
import { getFieldPlaceholder } from "../../utils/formHelper";
import {
    BUTTONS,
    CREATE_UNIT_CONSTS,
    FORBIDDEN_SYMBOLS,
    TAB_NUMBERS,
    TAB_TITLES,
} from "../../constants/create-unit/createUnit.constants";
import { generateText } from "../../utils/fakeData";
import { SERVICES } from "../../constants/catalog.constants";
import { formatMissingServiceError } from "../../utils/formatErrorMessages";
import { clickElement } from "../../utils/clickers";
import {
    expectServiceNonSelected,
    expectServiceSelected,
    expectTabActive,
    expectTabInactive,
    expectTextColorError,
} from "../../utils/uiMatchers";
import { getTwoRandomIndices } from "../../utils/getRandomIndices";

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
            async ({
                createUnitPageWithFilledTwoTabs:
                    _createUnitPageWithFilledTwoTabs,
                serviceComponent,
            }) => {
                const service =
                    SERVICES.subcategories["construction services"]
                        .subcategories.drilling.title;

                await test.step("The title: ⤵️", async () => {
                    await test.step("• is visible", async () => {
                        await expect(
                            serviceComponent.description,
                        ).toBeVisible();
                    });

                    await test.step(`• has the “${tabsFields.service.description}” text`, async () => {
                        await expect(
                            serviceComponent.description,
                        ).toContainText(tabsFields.service.description);
                    });

                    await test.step("• has an asterisk", async () => {
                        await expect(
                            serviceComponent.requiredSymbol,
                        ).toBeVisible();
                    });
                });

                await test.step("Clue line has the correct text", async () => {
                    await expect(serviceComponent.addInfo).toContainText(
                        tabsFields.service.addInfo,
                    );
                });

                await test.step("Loupe icon is: ⤵️", async () => {
                    await test.step("• visible", async () => {
                        await expect(serviceComponent.loupeIcon).toBeVisible();
                    });

                    await test.step("• located on the left side of the field", async () => {
                        const loupeBox =
                            await serviceComponent.getLoupeCoords();
                        const fieldBox =
                            await serviceComponent.getFieldCoords();
                        expect(loupeBox!.x).toBeLessThan(fieldBox!.x);
                    });
                });

                await test.step("Input field background has the valid text", async () => {
                    expect(
                        await getFieldPlaceholder(serviceComponent.field),
                    ).toContain(tabsFields.service.placeholder);
                });

                await test.step(`Input field cannot have these symbols: ${FORBIDDEN_SYMBOLS}`, async () => {
                    await serviceComponent.typeService(FORBIDDEN_SYMBOLS);
                    await expect(serviceComponent.field).toHaveValue("");
                    await serviceComponent.fillField(FORBIDDEN_SYMBOLS);
                    await expect(serviceComponent.field).toHaveValue("");
                });

                await test.step("The limit of string’s length is 100 symbols", async () => {
                    let service = generateText(101);
                    await serviceComponent.typeService(service);
                    expect(serviceComponent.field).toHaveValue(
                        service.slice(0, service.length - 1),
                    );

                    await serviceComponent.clearField();
                    await serviceComponent.fillField(service);
                    expect(serviceComponent.field).toHaveValue(
                        service.slice(0, service.length - 1),
                    );
                });

                await test.step("Dropdown is appeared after typing of one symbol", async () => {
                    await serviceComponent.clearField();
                    await serviceComponent.typeService("Б");
                    expect(
                        serviceComponent.searchResultsContainer,
                    ).toBeVisible();
                });

                await test.step("Dropdown shows the correct result regardless of the case of characters", async () => {
                    const testWords = [
                        service.toLowerCase(),
                        service.toUpperCase(),
                    ];
                    let baseResults: string[] | null = null;

                    for (const word of testWords) {
                        await serviceComponent.clearField();
                        await serviceComponent.typeService(word);

                        await serviceComponent.searchResultsContainer.waitFor({
                            state: "visible",
                        });

                        const currentResults =
                            await serviceComponent.searchResults.allTextContents();

                        if (!baseResults) baseResults = currentResults;
                        else expect(currentResults).toEqual(baseResults);
                    }
                });

                await test.step("After clicking on variant from dropdown “selected” mark appears in dropdown", async () => {
                    const firstResult = serviceComponent.searchResults.first();

                    expectServiceNonSelected(firstResult);

                    await serviceComponent.selectService();

                    expectServiceSelected(firstResult);
                });

                await test.step("The “Selected services” section: ⤵️", async () => {
                    await test.step("• has the correct title", async () => {
                        expect(
                            serviceComponent.selectedServicesSectionTitle,
                        ).toContainText(tabsFields.service.addedServicesTitle);
                    });

                    await test.step("• is visible", async () => {
                        expect(
                            serviceComponent.selectedServicesSectionTitle,
                        ).toBeVisible();
                        expect(
                            serviceComponent.selectedServicesSection,
                        ).toBeVisible();
                    });

                    await test.step("• has the selected service", async () => {
                        expect(
                            serviceComponent.selectedServices.first(),
                        ).toHaveText(service);
                    });
                });

                await test.step("The attached service has a remove icon", async () => {
                    expect(
                        serviceComponent.getRemoveIcon(
                            serviceComponent.selectedServices.first(),
                        ),
                    ).toBeVisible();
                });
            },
        );

        test(
            "Verify creating new service",
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C410" },
            },
            async ({
                createUnitPageWithFilledTwoTabsAndNewService,
                serviceComponent,
            }) => {
                const { createUnitPage: _createUniPage, service: newService } =
                    createUnitPageWithFilledTwoTabsAndNewService;

                await test.step("Filling a field with a non-existent service", async () => {
                    await serviceComponent.fillField(newService);
                    expect(serviceComponent.field).toHaveValue(newService);
                });

                await test.step("The dropdown: ⤵️", async () => {
                    await test.step("• shows valid reaction with notification text", async () => {
                        expect(
                            serviceComponent.notFoundServiceText,
                        ).toBeVisible();
                    });

                    await test.step("• shows the “Створити послугу” button", async () => {
                        expect(serviceComponent.addServiceButton).toBeVisible();
                    });

                    await test.step("• has the valid warning text", async () => {
                        expect(
                            serviceComponent.notFoundServiceText,
                        ).toContainText(formatMissingServiceError(newService));
                    });
                });

                await test.step("Creating service button has: ⤵️", async () => {
                    await test.step("• the correct name", async () => {
                        expect(serviceComponent.addServiceButton).toContainText(
                            tabsFields.service.addServiceButtonText,
                        );
                    });

                    await test.step("• the icon", async () => {
                        expect(serviceComponent.addServiceIcon).toBeVisible();
                    });
                });

                await test.step("* Click the button *", async () => {
                    await clickElement(serviceComponent.addServiceButton);
                });

                await test.step("After clicking the button: ⤵️", async () => {
                    await serviceComponent.selectedServices
                        .first()
                        .waitFor({ state: "visible" });

                    await test.step("• the service is selected", async () => {
                        expect(
                            serviceComponent.selectedServices.first(),
                        ).toHaveText(newService);
                    });

                    await test.step("• the category is appeared as existing", async () => {
                        expectServiceSelected(
                            serviceComponent.searchResults.first(),
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
            async ({
                createUnitPageWithFilledTwoTabs:
                    _createUnitPageWithFilledTwoTabs,
                serviceComponent,
            }) => {
                const letter = "Г";
                let allResults: string[] = [];
                let choosedResults: string[] = [];

                await test.step("It should show search results with inputed letter", async () => {
                    await serviceComponent.typeService(letter);

                    allResults =
                        await serviceComponent.searchResults.allTextContents();

                    expect(
                        allResults.every((service) =>
                            service.toUpperCase().includes(letter),
                        ),
                    ).toBeTruthy();
                });

                await test.step("After clicking on a variant: ⤵️", async () => {
                    const {
                        first: firstRandomIndex,
                        second: secondRandomIndex,
                    } = getTwoRandomIndices(allResults.length);

                    await test.step("• it becomes marked as selected", async () => {
                        await serviceComponent.selectService(firstRandomIndex);
                        expectServiceSelected(
                            serviceComponent.searchResults.nth(
                                firstRandomIndex,
                            ),
                        );

                        choosedResults.push(
                            (await serviceComponent.searchResults
                                .nth(firstRandomIndex)
                                .textContent()) ?? "",
                        );

                        if (secondRandomIndex) {
                            await serviceComponent.selectService(
                                secondRandomIndex,
                            );
                            expectServiceSelected(
                                serviceComponent.searchResults.nth(
                                    secondRandomIndex,
                                ),
                            );
                            choosedResults.push(
                                (await serviceComponent.searchResults
                                    .nth(secondRandomIndex)
                                    .textContent()) ?? "",
                            );
                        }
                    });

                    await test.step("• it gets into the list of selected services", async () => {
                        const pinnedServices =
                            await serviceComponent.selectedServices.allTextContents();

                        expect(
                            choosedResults.every((service) =>
                                pinnedServices.includes(service),
                            ),
                        ).toBeTruthy;
                    });
                });
            },
        );

        test(
            "Verify removing variants from choosed list",
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C412" },
            },
            async ({
                createUnitPageWithFilledTwoTabs:
                    _createUnitPageWithFilledTwoTabs,
                serviceComponent,
            }) => {
                // Select two services
                await serviceComponent.typeService("Г");
                await serviceComponent.searchResultsContainer.waitFor({
                    state: "visible",
                });
                await serviceComponent.selectService(0);
                await serviceComponent.selectService(1);

                await test.step("After clicking the delete button, the service is unlinked from the ad", async () => {
                    while (
                        (await serviceComponent.selectedServices.count()) > 0
                    ) {
                        const removingService =
                            await serviceComponent.selectedServices
                                .last()
                                .textContent();
                        await serviceComponent
                            .getRemoveIcon(
                                serviceComponent.selectedServices.last(),
                            )
                            .click();
                        const remainingServices =
                            await serviceComponent.selectedServices.allTextContents();
                        expect(
                            remainingServices.includes(removingService!),
                        ).toBeFalsy();
                    }
                });

                await test.step(`After deleting the last service, the “${tabsFields.service.addedServicesTitle}” panel disappears.`, async () => {
                    expect(
                        serviceComponent.selectedServicesSection,
                    ).toBeHidden();
                });
            },
        );

        test(
            `Verify “${BUTTONS.back}” button`,
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C413" },
            },
            async ({ createUnitPageWithFilledTwoTabs, photosComponent }) => {
                await test.step("The button has the correct text", async () => {
                    await expect(
                        createUnitPageWithFilledTwoTabs.cancelButton,
                    ).toHaveText(BUTTONS.back);
                });
                await test.step("The user is redirected to the previous tab after clicking the “Назад” button", async () => {
                    await createUnitPageWithFilledTwoTabs.previousStep();
                    await expectTabActive(
                        createUnitPageWithFilledTwoTabs.tabList.nth(1),
                    );
                    for (let i = 0; i < TAB_NUMBERS.length; i++) {
                        if (i === 1) continue;
                        await expectTabInactive(
                            createUnitPageWithFilledTwoTabs.tabList.nth(i),
                        );
                    }
                });

                await test.step("The data in the second tab is saved", async () => {
                    expect(
                        await photosComponent.uploadedPhotoButtons.count(),
                    ).toBeGreaterThanOrEqual(1);
                });
            },
        );

        test(
            `Verify “${BUTTONS.next}” button`,
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C414" },
            },
            async ({ createUnitPageWithFilledTwoTabs, serviceComponent }) => {
                await test.step("The button has the correct text", async () => {
                    await expect(
                        createUnitPageWithFilledTwoTabs.nextButton,
                    ).toHaveText(BUTTONS.next);
                });

                await test.step("The color of the clue line is red if user didn’t set any service", async () => {
                    await createUnitPageWithFilledTwoTabs.nextStep();
                    await expectTextColorError(
                        serviceComponent.addInfo,
                    );
                });

                await test.step("The user can proceed to the next tab after setting at least one service", async () => {
                    await serviceComponent.fillField("Г");
                    await serviceComponent.selectService();

                    await createUnitPageWithFilledTwoTabs.nextStep();

                    await expectTabActive(
                        createUnitPageWithFilledTwoTabs.tabList.nth(3),
                    );

                    await expect(
                        createUnitPageWithFilledTwoTabs.pageTitle,
                    ).toBeVisible();

                    await expect(
                        createUnitPageWithFilledTwoTabs.pageTitle,
                    ).toHaveText(CREATE_UNIT_CONSTS.PAGE_TITLE);
                });

                await test.step("Other tabs are inactive and unchanged", async () => {
                    for (let i = 0; i < TAB_NUMBERS.length; i++) {
                        if (i === 3) continue;

                        await expectTabInactive(
                            createUnitPageWithFilledTwoTabs.tabList.nth(i),
                        );

                        const { title: tabTitle, number: tabNumber } =
                            await createUnitPageWithFilledTwoTabs.getTabMetaInfo(
                                TAB_NUMBERS[i],
                            );
                        expect(tabTitle).toEqual(TAB_TITLES[i]);
                        expect(tabNumber).toEqual(TAB_NUMBERS[i]);
                    }
                });
            },
        );
    },
);
