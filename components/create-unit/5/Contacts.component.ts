import { Locator, Page } from "@playwright/test";

export class ContactsComponent {
    readonly page: Page;
    readonly isOperatorCheckbox: Locator;

    constructor(page: Page) {
        this.page = page;
        this.isOperatorCheckbox = this.page.getByTestId("operatorCheckbox");
    }

    async isOperator(): Promise<boolean> {
        return this.isOperatorCheckbox.isChecked();
    }

    async setAsOperator(): Promise<void> {
        if (!(await this.isOperator())) {
            this.isOperatorCheckbox.check();
        }
    }
}
