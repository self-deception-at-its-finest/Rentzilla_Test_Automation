import { Locator, Page } from "@playwright/test";
import { firstTabFields, KeysWithLabel } from "../../../constants/create-unit/fields.constants";

export abstract class BaseComponent {
    readonly page: Page;
    readonly section: Locator;
    readonly label: Locator;
    readonly requiredSymbol: Locator;

    constructor(page: Page, fieldLabel: KeysWithLabel) {
        this.page = page;
        this.section = this.page
            .getByText(firstTabFields[fieldLabel].label)
            .locator("..");

        this.label = this.section.getByText(
            new RegExp(
                `^${firstTabFields[fieldLabel].label}.*`,
            ),
        );
        this.requiredSymbol = this.section.locator("span", {
            hasText: "*",
        });
    }
}
