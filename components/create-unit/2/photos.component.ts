import { Locator, Page } from "@playwright/test";
import path from "path";

export class PhotosComponent {
    readonly page: Page;
    readonly uploadPhotoButtons: Locator;
    readonly uploadPhoto1: Locator;
    readonly fileInput: Locator;
    readonly filePath: string;

    constructor(page: Page) {
        this.page = page;
        this.uploadPhotoButtons = this.page
            .getByTestId("imageBlock")
            .locator("..");
        this.uploadPhoto1 = this.uploadPhotoButtons.first();
        this.fileInput = this.page.locator('input[type="file"]');
        this.filePath = path.resolve(
            __dirname,
            "../../../fixtures/photos/test-photo.png",
        );
    }

    async uploadPhoto() {
        await this.fileInput.setInputFiles(this.filePath);
    }
}
