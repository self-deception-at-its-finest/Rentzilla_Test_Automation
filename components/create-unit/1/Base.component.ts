import { Locator, Page } from "@playwright/test";
import { tabs } from "@constants/create-unit/fields.constants";
import { FieldActions } from "@components/FieldActions";
import { Tab1KeysWithLabel } from "@custom-types/tabs";

export abstract class BaseComponent {
    readonly section: Locator;
    readonly label: Locator;
    readonly requiredSymbol?: Locator;
    readonly tabTitle: Locator;

    private readonly fieldActions: FieldActions;

    constructor(
        protected readonly page: Page,
        fieldLabel: Tab1KeysWithLabel,
        required: boolean = true,
    ) {
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

        this.fieldActions = new FieldActions(this.page);
    }

    // Need to type, not paste
    protected async typeIntoField(field: Locator, str: string) {
        await this.fieldActions.typeIntoField(field, str);
    }

    protected async fillInField(field: Locator, str: string) {
        await this.fieldActions.fillInField(field, str);
    }

    protected async clearField(field: Locator) {
        await this.fieldActions.clearField(field);
    }
}
