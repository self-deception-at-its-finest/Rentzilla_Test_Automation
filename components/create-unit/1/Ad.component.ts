import { Page, Locator } from "@playwright/test";
import { BaseComponent } from "./Base.component";

export class AdComponent extends BaseComponent {
    readonly errorBlock: Locator;
    readonly field: Locator;

    constructor(page: Page) {
        super(page, "ad");
        this.field = this.section.getByRole("textbox");
        this.errorBlock = this.section.getByTestId("descriptionError");
    }

    async typeAd(str: string): Promise<void> {
        await super.typeIntoField(this.field, str);
    }

    async clearAdField(): Promise<void> {
        await super.clearField(this.field);
    }
}
