import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./t-Base.component";

export class SpecificationsComponent extends BaseComponent {
    readonly field: Locator;

    constructor(page: Page) {
        super(page, "specifications", false);
        this.field = this.page
            .getByTestId("textarea-customTextAriaDescription")
            .first();
    }

    async typeSpecifications(str: string): Promise<void> {
        await super.typeIntoField(this.field, str);
    }

    async clearSpecificationField(): Promise<void> {
        await super.clearTheField(this.field);
    }
}
