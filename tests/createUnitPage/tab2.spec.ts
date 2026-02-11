import { expect, test } from "../../fixtures/index";
import endpoints from "../../constants/endpoints.constants.json";
import {
    MAX_IMAGES,
    tabsFields,
} from "../../constants/create-unit/fields.constants";
import { clickElement } from "../../utils/clickers";
import {
    BUTTONS,
    CREATE_UNIT_CONSTS,
    TAB_NUMBERS,
    TAB_TITLES,
} from "../../constants/create-unit/createUnit.constants";
import { clickOutside } from "../../utils/closeModal";
import {
    expectTabActive,
    expectTabInactive,
    expectTextColorError,
} from "../../utils/uiMatchers";

test.describe(
    "“Create unit” page | The “Photos” tab",
    {
        annotation: [
            { type: "Testing page", description: "«Створення оголошення»" },
            { type: "Path to page", description: endpoints["create unit"] },
        ],
    },
    () => {
        test(
            "Verify image upload panels",
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C367" },
            },
            async ({
                createUnitPageWithFilledTab1: _createUnitPageWithFilledTab1,
                photosComponent,
            }) => {
                await test.step("The form title: ⤵️", async () => {
                    await test.step("• is visible", async () => {
                        await expect(
                            photosComponent.photosFormTitle,
                        ).toBeVisible();
                    });

                    await test.step(`• has the “${tabsFields.photos.photosForm.label}” text`, async () => {
                        await expect(
                            photosComponent.photosFormTitle,
                        ).toContainText(tabsFields.photos.photosForm.label);
                    });

                    await test.step("• has an asterisk", async () => {
                        await expect(
                            photosComponent.requiredSymbol,
                        ).toBeVisible();
                    });
                });

                await test.step("Clue line has the correct text", async () => {
                    await expect(
                        photosComponent.photosFormDescription,
                    ).toBeVisible();
                });

                await test.step("The “Upload file” window appears after clicking on the buttons", async () => {
                    let count =
                        await photosComponent.uploadPhotoButtons.count();
                    for (let i = 0; i < count; i++) {
                        const [fileChooser] = await Promise.all([
                            photosComponent.page.waitForEvent("filechooser"),
                            await clickElement(
                                photosComponent.uploadPhotoButtons.nth(i),
                            ),
                        ]);

                        // Verify that the click triggered a file chooser
                        // and Playwright was able to identify
                        // the <input type="file"> element.
                        expect(fileChooser.element()).toBeTruthy();
                        await fileChooser.setFiles([]);
                    }
                });

                await test.step(`${MAX_IMAGES} valid images loaded successfully`, async () => {
                    for (let i = 1; i <= MAX_IMAGES; i++) {
                        await photosComponent.uploadPhoto(String(i));
                    }

                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(MAX_IMAGES);
                });

                await test.step("Images are swapped after dragging the random image to the first slot", async () => {
                    // Get the start order
                    const orderBeforeDragging =
                        await photosComponent.getAllImageSrcs();
                    // Get random index excluding 0
                    const randomIndex =
                        Math.floor(
                            Math.random() * (orderBeforeDragging.length - 1),
                        ) + 1;

                    const mainImageBeforeDragging = orderBeforeDragging[0];
                    const randomImageBeforeDragging =
                        orderBeforeDragging[randomIndex];
                    // Move the random image to “ГОЛОВНЕ”
                    await photosComponent.dragImage(randomIndex, 0);

                    // Get the current order
                    const orderAfterDragging =
                        await photosComponent.getAllImageSrcs();

                    const mainImageAfterDragging = orderAfterDragging[0];
                    const randomImageAfterDragging =
                        orderAfterDragging[randomIndex];

                    expect(mainImageAfterDragging).toBe(
                        randomImageBeforeDragging,
                    );
                    expect(randomImageAfterDragging).toBe(
                        mainImageBeforeDragging,
                    );
                });

                await test.step("Delete button appears after hovering the cursor on the image", async () => {
                    const count =
                        await photosComponent.uploadedPhotoButtons.count();
                    for (let i = 0; i < count; i++) {
                        const photo =
                            photosComponent.uploadedPhotoButtons.nth(i);

                        await photo.hover();
                        await expect(
                            photosComponent.getRemoveButton(photo),
                        ).toBeVisible();
                    }
                });

                await test.step("Placeholder count matches images count rule", async () => {
                    await photosComponent.removePhotos(5);

                    // After removing 5 images,
                    // there should be 1 placeholder (since 7 images remain)
                    // (two images’ lines remaining)
                    await expect(
                        photosComponent.placeholderButtons,
                    ).toHaveCount(1);

                    await photosComponent.removePhotos(4);

                    // After removing 4 images,
                    // there should be 1 placeholder (since 3 images remain)
                    // (one images’ line remaining)
                    await expect(
                        photosComponent.placeholderButtons,
                    ).toHaveCount(1);

                    await photosComponent.removePhotos();

                    await expect(
                        photosComponent.placeholderButtons,
                    ).toHaveCount(4);
                });
            },
        );

        test(
            "Verify same images uploading",
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C384" },
            },
            async ({
                createUnitPageWithFilledTab1: _createUnitPageWithFilledTab1,
                photosComponent,
            }) => {
                await test.step("The error modal appears when uploading the same image twice", async () => {
                    await photosComponent.uploadPhoto("1");
                    await photosComponent.uploadPhoto("1");
                    await expect(photosComponent.errorModalText).toBeVisible();
                    await expect(photosComponent.errorModalText).toContainText(
                        tabsFields.photos.errorModals.sameImage,
                    );
                });

                await test.step("The error modal can be closed by the close icon", async () => {
                    await photosComponent.closeModalIcon.click();
                    await expect(photosComponent.errorModalText).toBeHidden();
                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(1);
                });

                await test.step(`The error modal can be closed by the “${tabsFields.photos.errorModals.button}” button`, async () => {
                    await photosComponent.uploadPhoto("1");
                    await expect(photosComponent.errorModalOKButton).toHaveText(
                        tabsFields.photos.errorModals.button,
                    );
                    await photosComponent.errorModalOKButton.click();
                    await expect(photosComponent.errorModalText).toBeHidden();
                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(1);
                });

                await test.step("The error modal can be closed by clicking outside the modal", async () => {
                    await photosComponent.uploadPhoto("1");

                    await clickOutside(photosComponent.page);
                    await expect(photosComponent.errorModalText).toBeHidden();
                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(1);
                });
            },
        );

        test(
            "Verify uploading of invalid file type",
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C401" },
            },
            async ({
                createUnitPageWithFilledTab1: _createUnitPageWithFilledTab1,
                photosComponent,
            }) => {
                await test.step("The error modal appears when uploading an invalid file type", async () => {
                    await photosComponent.uploadPhoto("invalid_image");
                    await expect(photosComponent.errorModalText).toBeVisible();
                    await expect(photosComponent.errorModalText).toContainText(
                        tabsFields.photos.errorModals.invalidPhoto,
                    );
                });

                await test.step("The error modal can be closed by the close icon", async () => {
                    await photosComponent.uploadPhoto("invalid_image");
                    await photosComponent.closeModalIcon.click();
                    await expect(photosComponent.errorModalText).toBeHidden();
                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(0);
                });

                await test.step(`The error modal can be closed by the “${tabsFields.photos.errorModals.button}” button`, async () => {
                    await photosComponent.uploadPhoto("invalid_image");
                    await expect(photosComponent.errorModalOKButton).toHaveText(
                        tabsFields.photos.errorModals.button,
                    );
                    await photosComponent.errorModalOKButton.click();
                    await expect(photosComponent.errorModalText).toBeHidden();
                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(0);
                });

                await test.step("The error modal can be closed by clicking outside the modal", async () => {
                    await photosComponent.uploadPhoto("invalid_image");

                    await clickOutside(photosComponent.page);
                    await expect(photosComponent.errorModalText).toBeHidden();
                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(0);
                });
            },
        );

        test(
            "Verify uploading of invalid size file",
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C405" },
            },
            async ({
                createUnitPageWithFilledTab1: _createUnitPageWithFilledTab1,
                photosComponent,
            }) => {
                await test.step("The error modal appears when uploading an excessively large file", async () => {
                    await photosComponent.uploadPhoto("large_image");
                    await expect(photosComponent.errorModalText).toBeVisible();
                    await expect(photosComponent.errorModalText).toContainText(
                        tabsFields.photos.errorModals.invalidPhoto,
                    );
                });

                await test.step("The error modal can be closed by the close icon", async () => {
                    await photosComponent.uploadPhoto("large_image");
                    await photosComponent.closeModalIcon.click();
                    await expect(photosComponent.errorModalText).toBeHidden();
                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(0);
                });

                await test.step(`The error modal can be closed by the “${tabsFields.photos.errorModals.button}” button`, async () => {
                    await photosComponent.uploadPhoto("large_image");
                    await expect(photosComponent.errorModalOKButton).toHaveText(
                        tabsFields.photos.errorModals.button,
                    );
                    await photosComponent.errorModalOKButton.click();
                    await expect(photosComponent.errorModalText).toBeHidden();
                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(0);
                });

                await test.step("The error modal can be closed by clicking outside the modal", async () => {
                    await photosComponent.uploadPhoto("large_image");

                    await clickOutside(photosComponent.page);
                    await expect(photosComponent.errorModalText).toBeHidden();
                    await expect(
                        photosComponent.uploadedPhotoButtons,
                    ).toHaveCount(0);
                });
            },
        );

        test(
            `Verify “${BUTTONS.back}” button`,
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C390" },
            },
            async ({
                createUnitPageWithFilledTab1,
                categoryComponent,
                adComponent,
                manufacturerComponent,
                locationComponent,
            }) => {
                await test.step("The button has the correct text", async () => {
                    await expect(
                        createUnitPageWithFilledTab1.cancelButton,
                    ).toHaveText(BUTTONS.back);
                });
                await test.step("The user is redirected to the previous tab after clicking the “Назад” button", async () => {
                    await createUnitPageWithFilledTab1.previousStep();
                    await expectTabActive(
                        createUnitPageWithFilledTab1.tabList.first(),
                    );
                    for (let i = 1; i < TAB_NUMBERS.length; i++) {
                        await expectTabInactive(
                            createUnitPageWithFilledTab1.tabList.nth(i),
                        );
                    }
                });

                await test.step("The data in the first tab is saved", async () => {
                    await expect(categoryComponent.field).not.toBeEmpty();
                    await expect(adComponent.field).not.toBeEmpty();
                    await expect(
                        manufacturerComponent.clearButton,
                    ).toBeVisible();
                    await expect(
                        locationComponent.locationLabel,
                    ).not.toBeEmpty();
                });
            },
        );

        test(
            `Verify “${BUTTONS.next}” button`,
            {
                tag: ["@UI"],
                annotation: { type: "Test case", description: "C393" },
            },
            async ({ createUnitPageWithFilledTab1, photosComponent }) => {
                await test.step("The button has the correct text", async () => {
                    await expect(
                        createUnitPageWithFilledTab1.nextButton,
                    ).toHaveText(BUTTONS.next);
                });

                await test.step("The color of the clue line is red if user didn’t upload any image", async () => {
                    await createUnitPageWithFilledTab1.nextStep();
                    await expectTextColorError(
                        photosComponent.photosFormDescription,
                    );
                });

                await test.step("The user can proceed to the next tab after uploading at least one image", async () => {
                    await photosComponent.uploadPhoto("1");
                    await createUnitPageWithFilledTab1.nextStep();
                    await expectTabActive(
                        createUnitPageWithFilledTab1.tabList.nth(2),
                    );
                    await expect(
                        createUnitPageWithFilledTab1.pageTitle,
                    ).toBeVisible();
                    await expect(
                        createUnitPageWithFilledTab1.pageTitle,
                    ).toHaveText(CREATE_UNIT_CONSTS.PAGE_TITLE);
                });

                await test.step("Other tabs are inactive and unchanged", async () => {
                    for (let i = 0; i < TAB_NUMBERS.length; i++) {
                        if (i === 2) continue;

                        await expectTabInactive(
                            createUnitPageWithFilledTab1.tabList.nth(i),
                        );

                        const { title: tabTitle, number: tabNumber } =
                            await createUnitPageWithFilledTab1.getTabMetaInfo(
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
