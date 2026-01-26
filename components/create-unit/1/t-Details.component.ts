import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./t-Base.component";

export class DetailsComponent extends BaseComponent {
    readonly field: Locator;

    constructor(page: Page) {
        super(page, "details", false);
        this.field = this.page
            .getByTestId("textarea-customTextAriaDescription")
            .nth(1);
    }

    async typeDetails(str: string): Promise<void> {
        await super.typeIntoField(this.field, str);
    }

    async clearDetailsField(): Promise<void> {
        await super.clearTheField(this.field);
    }
}
