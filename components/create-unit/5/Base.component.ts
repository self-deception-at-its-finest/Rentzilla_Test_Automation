import { tabs } from "@constants/create-unit/fields.constants";
import type { Locator, Page } from "@playwright/test";
import { FieldActions } from "@components/FieldActions";

export abstract class BaseComponent {
    readonly contactsOfOperatorTitle: Locator;
    readonly contactsOfOperatorContainer: Locator;
    readonly operatorLabel: Locator;
    readonly operatorSection: Locator;
    readonly isOperatorCheckbox: Locator;
    readonly operatorFirstNameWrapper: Locator;
    readonly operatorFirstNameLabel: Locator;
    readonly operatorFirstNameInput: Locator;
    readonly operatorFirstNameInputErrorText: Locator;
    readonly operatorLastNameWrapper: Locator;
    readonly operatorLastNameLabel: Locator;
    readonly operatorLastNameInput: Locator;
    readonly operatorLastNameInputErrorText: Locator;
    readonly operatorPhoneWrapper: Locator;
    readonly operatorPhoneLabel: Locator;
    readonly operatorPhoneInput: Locator;
    readonly operatorPhoneInputErrorText: Locator;

    readonly fieldActions: FieldActions;

    constructor(protected readonly page: Page) {
        this.contactsOfOperatorContainer = this.page
            .getByText(tabs.contacts.contactsOfOperatorLabel)
            .locator("..");
        this.contactsOfOperatorTitle =
            this.contactsOfOperatorContainer.getByText(
                tabs.contacts.contactsOfOperatorLabel,
            );

        this.isOperatorCheckbox =
            this.contactsOfOperatorContainer.getByTestId("operatorCheckbox");
        this.operatorLabel = this.contactsOfOperatorContainer.locator(
            'label[for="operator"]',
        );

        this.operatorFirstNameWrapper = this.contactsOfOperatorContainer
            .getByTestId("wrapper")
            .last();
        this.operatorLastNameWrapper = this.contactsOfOperatorContainer
            .getByTestId("wrapper")
            .first();
        this.operatorSection = this.operatorLabel
            .locator("..")
            .locator(" + div");

        this.operatorFirstNameInput = this.operatorSection.locator(
            'input[name="lNameOperator"]',
        );
        this.operatorLastNameInput = this.operatorSection.locator(
            'input[name="fNameOperator"]',
        );
        this.operatorPhoneInput = this.page.getByTestId("phone");
        this.operatorFirstNameInputErrorText = this.operatorFirstNameInput
            .locator("..")
            .getByTestId("errorDescr");
        this.operatorLastNameInputErrorText = this.operatorLastNameInput
            .locator("..")
            .getByTestId("errorDescr");
        this.operatorPhoneInputErrorText =
            this.page.getByTestId("errorMessage");
        this.operatorPhoneWrapper = this.operatorPhoneInput.locator("../..");
        this.operatorFirstNameLabel = this.operatorFirstNameWrapper.locator(
            "> div:first-of-type",
        );
        this.operatorLastNameLabel = this.operatorLastNameWrapper.locator(
            "> div:first-of-type",
        );
        this.operatorPhoneLabel = this.operatorPhoneWrapper.locator(
            "> div:first-of-type",
        );

        this.fieldActions = new FieldActions(this.page);
    }

    private async isOperator(): Promise<boolean> {
        return this.isOperatorCheckbox.isChecked();
    }

    async checkAsOperator(
        element: Locator = this.isOperatorCheckbox,
    ): Promise<void> {
        if (!(await this.isOperator())) {
            element.click();
        }
    }

    async uncheckAsOperator(
        element: Locator = this.isOperatorCheckbox,
    ): Promise<void> {
        if (await this.isOperator()) {
            element.click();
        }
    }

    protected async chooseItemInDropdown(item: Locator): Promise<void> {
        await item.click();
    }

    async isRequired(fieldLabel: Locator): Promise<boolean> {
        return (
            (await fieldLabel.locator("span", { hasText: "*" }).count()) === 1
        );
    }
}
