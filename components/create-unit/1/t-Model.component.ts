import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./t-Base.component";

export class ModelComponent extends BaseComponent {
    readonly field: Locator;
    readonly errorBlock: Locator;
    constructor(page: Page) {
        super(page, "model", true);
        this.field = this.section.getByRole("textbox");
        this.errorBlock = this.section.getByTestId("descriptionError");
    }
    async typeModel(str: string): Promise<void> {
        await super.typeIntoField(this.field, str);
    }

    async clearModelField(): Promise<void> {
        await super.clearTheField(this.field);
    }
}
