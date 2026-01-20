import { Page, Locator } from "@playwright/test";
import { BaseComponent } from "./base.component";

export class AdComponent extends BaseComponent {
    readonly errorBlock: Locator;
    readonly field: Locator;

    constructor(page: Page) {
        super(page, "ad");
        this.field = this.section.getByRole("textbox");
        this.errorBlock = this.section.getByTestId("descriptionError");
    }

    // Need to type, not paste
    async typeIntoField(str: string) {
        await this.field.click();
        await this.page.keyboard.type(str);
    }

    async clearTheField() {
        await this.field.fill("");
    }
}
