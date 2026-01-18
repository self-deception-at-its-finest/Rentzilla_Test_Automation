import { Page, Locator } from "@playwright/test";
import createUnitConstsJSON from "../../../constants/create-unit/create-unit.constants.json";

export class AdComponent {
    readonly page: Page;
    readonly section: Locator;
    readonly label: Locator;
    readonly requiredSymbol: Locator;
    readonly field: Locator;
    readonly errorBlock: Locator;

    constructor(page: Page) {
        this.page = page;
        this.section = this.page
            .getByText(createUnitConstsJSON["tabs"]["1"]["ad"]["label"])
            .locator("..");

        this.label = this.section.getByText(
            new RegExp(
                `^${createUnitConstsJSON["tabs"]["1"]["ad"]["label"]}.*`,
            ),
        );
        this.requiredSymbol = this.section.locator("span", {
            hasText: "*",
        });
        this.field = this.section.getByRole("textbox");
        this.errorBlock = this.section.getByTestId("descriptionError");
    }

    // Need to type, not paste
    async typeIntoField(str: string) {
        await this.field.click();
        await this.page.keyboard.type(str);
    }

    async clearTheField() {
        await this.field.fill('');
    }
}
