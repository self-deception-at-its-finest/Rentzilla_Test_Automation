import { Locator, Page } from "@playwright/test";
import path from "path";

export class PhotosComponent {
    readonly page: Page;
    readonly uploadPhotoButtons: Locator;
    readonly uploadPhoto1: Locator;
    readonly fileInput: Locator;

    constructor(page: Page) {
        this.page = page;
        this.uploadPhotoButtons = this.page
            .getByTestId("imageBlock")
            .locator("..");
        this.uploadPhoto1 = this.uploadPhotoButtons.first();
        this.fileInput = this.page.locator('input[type="file"]');
    }

    async uploadPhoto(fileName: string) {
        let filePath = path.resolve(
            __dirname,
            `../../../fixtures/photos/${fileName}`,
        );
        await this.fileInput.setInputFiles(filePath);
    }
}
