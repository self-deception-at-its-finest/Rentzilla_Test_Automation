import path from "path";
import fs from "fs";
import { Locator, Page } from "@playwright/test";
import { tabsFields } from "../../../constants/create-unit/fields.constants";

export class PhotosComponent {
    readonly page: Page;
    readonly photosFormTitle: Locator;
    readonly photosFormDescription: Locator;
    readonly uploadPhotoButtonsWrapper: Locator;
    readonly uploadPhotoButtons: Locator;
    readonly uploadedPhotoButtons: Locator;
    readonly placeholderButtons: Locator;
    readonly fileInput: Locator;
    readonly requiredSymbol: Locator;

    readonly errorModalText: Locator;
    readonly closeModalIcon: Locator;
    readonly errorModalOKButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.photosFormTitle = this.page
            .getByTestId("ImagesUnitFlow")
            .getByText(new RegExp(`^${tabsFields.photos.photosForm.label}.*`));
        this.photosFormDescription = this.page
            .getByTestId("ImagesUnitFlow")
            .getByTestId("description");
        this.uploadPhotoButtonsWrapper = this.page
            .getByTestId("imageBlock")
            .locator("..");
        this.uploadPhotoButtons =
            this.uploadPhotoButtonsWrapper.getByTestId("imageBlock");
        this.uploadedPhotoButtons =
            this.uploadPhotoButtonsWrapper.locator("[draggable='true']");
        this.placeholderButtons = this.uploadPhotoButtonsWrapper.locator(
            "[draggable='false']",
        );
        this.fileInput = this.page.locator('input[type="file"]');
        this.requiredSymbol = this.photosFormTitle.locator("span");
        this.errorModalText = this.page.getByTestId("errorPopup");
        this.errorModalOKButton = this.errorModalText
            .locator("..")
            .getByRole("button");
        this.closeModalIcon = this.errorModalText
            .locator("../..")
            .getByTestId("closeIcon");
    }

    async uploadPhoto(baseName: string) {
        const extensions = ["jpg", "jpeg", "png", "gif"];
        // Images directory
        const basePath = path.resolve(__dirname, "../../../test-data/images");
        // Looking for the first existing file
        for (const ext of extensions) {
            const filePath = path.join(basePath, `${baseName}.${ext}`);
            if (fs.existsSync(filePath)) {
                await this.fileInput.setInputFiles(filePath);
                return;
            }
        }
    }

    getRemoveButton(image: Locator) {
        return image.getByTestId("deleteImage");
    }

    async removePhotos(count: number | null = null) {
        const imagesForRemoving =
            count ?? (await this.uploadedPhotoButtons.count());
        for (let i = imagesForRemoving - 1; i >= 0; i--) {
            await this.uploadedPhotoButtons.last().click();
        }
    }

    private async getImageSrcByIndex(index: number): Promise<string | null> {
        return await this.uploadPhotoButtons.nth(index).getAttribute("src");
    }

    async dragImage(fromIndex: number, toIndex: number): Promise<void> {
        const source = this.uploadedPhotoButtons.nth(fromIndex);
        const target = this.uploadedPhotoButtons.nth(toIndex);
        await source.dragTo(target);
    }

    async getAllImageSrcs(): Promise<(string | null)[]> {
        const count = await this.uploadedPhotoButtons.count();
        const result: (string | null)[] = [];

        for (let i = 0; i < count; i++) {
            result.push(await this.getImageSrcByIndex(i));
        }

        return result;
    }
}
