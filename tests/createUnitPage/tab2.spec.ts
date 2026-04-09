import { expect, test } from "@fixtures/indexV2";
import endpoints from "@constants/endpoints.constants.json";
import { MAX_IMAGES, tabs } from "@constants/create-unit/fields.constants";
import { clickElement } from "@utils/clickers";
import {
	BUTTONS,
	createUnitConsts as data,
	TAB_NUMBERS,
	TAB_TITLES,
} from "@constants/create-unit/createUnit.constants";
import { clickOutside } from "@utils/closeModal";
import { expectTabActive, expectTabInactive, expectTextColorError } from "@utils/uiMatchers";

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
			async ({ createUnitPageWithFilledTab1: page }) => {
				await test.step("The form title: ⤵️", async () => {
					await test.step("• is visible", async () => {
						await expect(page.photosTab.photosFormTitle).toBeVisible();
					});

					await test.step(`• has the “Фото технічного засобу” text`, async () => {
						await expect(page.photosTab.photosFormTitle).toContainText(tabs.photos.photosForm.label);
					});

					await test.step("• has an asterisk", async () => {
						await expect(page.photosTab.requiredSymbol).toBeVisible();
					});
				});

				await test.step("Clue line has the correct text", async () => {
					await expect(page.photosTab.photosFormDescription).toBeVisible();
				});

				await test.step("The “Upload file” window appears after clicking on the buttons", async () => {
					const count = await page.photosTab.uploadPhotoButtons.count();
					for (let i = 0; i < count; i++) {
						const [fileChooser] = await Promise.all([
							page.photosTab.page.waitForEvent("filechooser"),
							clickElement(page.photosTab.uploadPhotoButtons.nth(i)),
						]);

						// Verify that the click triggered a file chooser
						// and Playwright was able to identify
						// the <input type="file"> element.
						expect(fileChooser.element()).toBeTruthy();
						await fileChooser.setFiles([]);
					}
				});

				await test.step(`12 valid images loaded successfully`, async () => {
					for (let i = 1; i <= MAX_IMAGES; i++) {
						const before = await page.photosTab.uploadedPhotoButtons.count();

						await page.photosTab.uploadPhoto(String(i));

						await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(before + 1);
					}

					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(MAX_IMAGES);
				});

				await test.step("Images are swapped after dragging the random image to the first slot", async () => {
					// Get the start order
					const orderBeforeDragging = await page.photosTab.getAllImageSrcs();
					// Get random index excluding 0
					const randomIndex = Math.floor(Math.random() * (orderBeforeDragging.length - 1)) + 1;

					const mainImageBeforeDragging = orderBeforeDragging[0];
					const randomImageBeforeDragging = orderBeforeDragging[randomIndex];
					// Move the random image to “ГОЛОВНЕ”
					await page.photosTab.dragImage(randomIndex, 0);

					// Get the current order
					const orderAfterDragging = await page.photosTab.getAllImageSrcs();

					const mainImageAfterDragging = orderAfterDragging[0];
					const randomImageAfterDragging = orderAfterDragging[randomIndex];

					expect(mainImageAfterDragging).toBe(randomImageBeforeDragging);
					expect(randomImageAfterDragging).toBe(mainImageBeforeDragging);
				});

				await test.step("Delete button appears after hovering the cursor on the image", async () => {
					const count = await page.photosTab.uploadedPhotoButtons.count();
					for (let i = 0; i < count; i++) {
						const photo = page.photosTab.uploadedPhotoButtons.nth(i);

						await photo.hover();
						await expect(page.photosTab.getRemoveButton(photo)).toBeVisible();
					}
				});

				await test.step("Placeholder count matches images count rule", async () => {
					await page.photosTab.removePhotos(5);

					// After removing 5 images,
					// there should be 1 placeholder (since 7 images remain)
					// (two images’ lines remaining)
					await expect(page.photosTab.placeholderButtons).toHaveCount(1);

					await page.photosTab.removePhotos(4);

					// After removing 4 images,
					// there should be 1 placeholder (since 3 images remain)
					// (one images’ line remaining)
					await expect(page.photosTab.placeholderButtons).toHaveCount(1);

					await page.photosTab.removePhotos();

					await expect(page.photosTab.placeholderButtons).toHaveCount(4);
				});
			},
		);

		test(
			"Verify same images uploading",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C384" },
			},
			async ({ createUnitPageWithFilledTab1: page }) => {
				await test.step("The error modal appears when uploading the same image twice", async () => {
					await page.photosTab.uploadPhoto("1");
					await page.photosTab.uploadPhoto("1");

					await expect(page.photosTab.errorModalText).toBeVisible();
					await expect(page.photosTab.errorModalText).toContainText(tabs.photos.errorModals.sameImage);
				});

				await test.step("The error modal can be closed by the close icon", async () => {
					await page.photosTab.closeModalIcon.click();
					await expect(page.photosTab.errorModalText).toBeHidden();
					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(1);
				});

				await test.step(`The error modal can be closed by the “${tabs.photos.errorModals.buttonText}” button`, async () => {
					await page.photosTab.uploadPhoto("1");

					await expect(page.photosTab.errorModalOKButton).toHaveText(tabs.photos.errorModals.buttonText);
					await page.photosTab.errorModalOKButton.click();
					await expect(page.photosTab.errorModalText).toBeHidden();
					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(1);
				});

				await test.step("The error modal can be closed by clicking outside the modal", async () => {
					await page.photosTab.uploadPhoto("1");

					await clickOutside(page.photosTab.page);
					await expect(page.photosTab.errorModalText).toBeHidden();
					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(1);
				});
			},
		);

		test(
			"Verify uploading of invalid file type",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C401" },
			},
			async ({ createUnitPageWithFilledTab1: page }) => {
				await test.step("The error modal appears when uploading an invalid file type", async () => {
					await page.photosTab.uploadPhoto("invalid_image");

					await expect(page.photosTab.errorModalText).toBeVisible();
					await expect(page.photosTab.errorModalText).toContainText(tabs.photos.errorModals.invalidPhoto);
				});

				await test.step("The error modal can be closed by the close icon", async () => {
					await page.photosTab.uploadPhoto("invalid_image");

					await page.photosTab.closeModalIcon.click();
					await expect(page.photosTab.errorModalText).toBeHidden();
					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(0);
				});

				await test.step(`The error modal can be closed by the “${tabs.photos.errorModals.buttonText}” button`, async () => {
					await page.photosTab.uploadPhoto("invalid_image");

					await expect(page.photosTab.errorModalOKButton).toHaveText(tabs.photos.errorModals.buttonText);
					await page.photosTab.errorModalOKButton.click();
					await expect(page.photosTab.errorModalText).toBeHidden();
					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(0);
				});

				await test.step("The error modal can be closed by clicking outside the modal", async () => {
					await page.photosTab.uploadPhoto("invalid_image");

					await clickOutside(page.photosTab.page);
					await expect(page.photosTab.errorModalText).toBeHidden();
					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(0);
				});
			},
		);

		test(
			"Verify uploading of invalid size file",
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C405" },
			},
			async ({ createUnitPageWithFilledTab1: page }) => {
				await test.step("The error modal appears when uploading an excessively large file", async () => {
					await page.photosTab.uploadPhoto("large_image");

					await expect(page.photosTab.errorModalText).toBeVisible();
					await expect(page.photosTab.errorModalText).toContainText(tabs.photos.errorModals.invalidPhoto);
				});

				await test.step("The error modal can be closed by the close icon", async () => {
					await page.photosTab.uploadPhoto("large_image");

					await page.photosTab.closeModalIcon.click();
					await expect(page.photosTab.errorModalText).toBeHidden();
					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(0);
				});

				await test.step(`The error modal can be closed by the “${tabs.photos.errorModals.buttonText}” button`, async () => {
					await page.photosTab.uploadPhoto("large_image");

					await expect(page.photosTab.errorModalOKButton).toHaveText(tabs.photos.errorModals.buttonText);
					await page.photosTab.errorModalOKButton.click();
					await expect(page.photosTab.errorModalText).toBeHidden();
					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(0);
				});

				await test.step("The error modal can be closed by clicking outside the modal", async () => {
					await page.photosTab.uploadPhoto("large_image");

					await clickOutside(page.photosTab.page);
					await expect(page.photosTab.errorModalText).toBeHidden();
					await expect(page.photosTab.uploadedPhotoButtons).toHaveCount(0);
				});
			},
		);

		test(
			`Verify “Назад” button`,
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C390" },
			},
			async ({ createUnitPageWithFilledTab1: page }) => {
				await test.step("The button has the correct text", async () => {
					await expect(page.cancelButton).toHaveText(BUTTONS.BACK);
				});
				await test.step("The user is redirected to the previous tab after clicking the “Назад” button", async () => {
					await page.previousStep();
					await expectTabActive(page.tabList.first());
					for (let i = 1; i < TAB_NUMBERS.length; i++) {
						await expectTabInactive(page.tabList.nth(i));
					}
				});

				await test.step("The data in the first tab is saved", async () => {
					await expect(page.mainInfoTab.categorySection.field).not.toBeEmpty();
					await expect(page.mainInfoTab.adSection.field).not.toBeEmpty();
					await expect(page.mainInfoTab.manufacturerSection.clearButton).toBeVisible();
					await expect(page.mainInfoTab.locationSection.locationLabel).not.toBeEmpty();
				});
			},
		);

		test(
			`Verify “Далі” button`,
			{
				tag: ["@UI"],
				annotation: { type: "Test case", description: "C393" },
			},
			async ({ createUnitPageWithFilledTab1: page }) => {
				await test.step("The button has the correct text", async () => {
					await expect(page.nextButton).toHaveText(BUTTONS.NEXT);
				});

				await test.step("The color of the clue line is red if user didn’t upload any image", async () => {
					await page.nextStep();
					await expectTextColorError(page.photosTab.photosFormDescription);
				});

				await test.step("The user can proceed to the next tab after uploading at least one image", async () => {
					await page.photosTab.uploadPhoto("1");
					await page.nextStep();
					await expectTabActive(page.tabList.nth(2));
					await expect(page.pageTitle).toBeVisible();
					await expect(page.pageTitle).toHaveText(data.pageTitle);
				});

				await test.step("Other tabs are inactive and unchanged", async () => {
					for (let i = 0; i < TAB_NUMBERS.length; i++) {
						if (i === 2) continue;

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
