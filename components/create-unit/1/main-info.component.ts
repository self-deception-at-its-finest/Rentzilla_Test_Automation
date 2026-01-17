import { Locator, Page } from "@playwright/test";
import createUnitConstants from "../../../constants/create-unit.constants.json";

export class MainInfoComponent {
    readonly borderColor = "#f73859";

    readonly page: Page;

    readonly categorySection: Locator;
    readonly label: Locator;
    readonly requiredSymbol: Locator;
    readonly field: Locator;
    readonly fieldPlaceholder: Locator;
    readonly fieldArrow: Locator;
    readonly errorBlock: Locator;

    constructor(page: Page) {
        this.page = page;

        this.categorySection = page
            .getByText(createUnitConstants["tabs"]["1"]["category"]["label"])
            .locator("..");

        this.label = this.categorySection.getByText(
            new RegExp(
                `^${createUnitConstants["tabs"]["1"]["category"]["label"]}.*`
            )
        );
        this.requiredSymbol = this.categorySection.locator("span", {
            hasText: "*",
        });
        this.field = this.categorySection.getByTestId("buttonDiv");
        this.fieldPlaceholder = this.field.getByTestId("categoryName");
        this.fieldArrow = this.field.locator("img[alt='Arrow-down']");
        this.errorBlock = this.categorySection.locator("+ div");
    }

    async clickCategorySelect() {
        await this.field.click();
    }
}
