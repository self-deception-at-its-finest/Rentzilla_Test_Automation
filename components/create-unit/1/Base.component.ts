import { Locator, Page } from "@playwright/test";
import {
    tabs,
    KeysWithLabel,
} from "../../../constants/create-unit/fields.constants";

export abstract class BaseComponent {
    readonly page: Page;
    readonly section: Locator;
    readonly label: Locator;
    readonly requiredSymbol?: Locator;
    readonly tabTitle: Locator;

    constructor(
        page: Page,
        fieldLabel: KeysWithLabel,
        required: boolean = true,
    ) {
        this.page = page;
        this.tabTitle = this.page
            .getByTestId("wrapper-characteristics")
            .getByText("Основна інформація");
        this.section = this.page
            .getByText(tabs.mainInfo[fieldLabel].label)
            .locator("..");

        this.label = this.section.getByText(
            new RegExp(`^${tabs.mainInfo[fieldLabel].label}.*`),
        );
        if (required)
            this.requiredSymbol = this.section.locator("span", {
                hasText: "*",
            });
    }

    // Need to type, not paste
    protected async typeIntoField(field: Locator, str: string) {
        await field.click();
        await this.page.keyboard.type(str);
    }

    protected async fillInField(field: Locator, str: string) {
        await field.fill(str);
    }

    protected async clearField(field: Locator) {
        await field.clear();
    }
}
