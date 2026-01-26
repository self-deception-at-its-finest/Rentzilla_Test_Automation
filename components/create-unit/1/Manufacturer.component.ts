import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./temp-Base.component";
import { FIELDS_ERRORS } from "../../../constants/create-unit/createUnit.constants";

export class ManufacturerComponent extends BaseComponent {
    readonly errorBlock: Locator;
    readonly field: Locator;
    readonly fieldWrapper: Locator;
    readonly chosenManufacturer: Locator;
    readonly clearButton: Locator;
    readonly searchResults: Locator;
    readonly firstResult: Locator;
    readonly missingResults: Locator;

    constructor(page: Page) {
        super(page, "manufacturer");
        this.field = this.section.getByRole("textbox");
        this.chosenManufacturer = this.page.getByTestId(
            "div-service-customSelectWithSearch",
        );
        this.clearButton = this.page.getByTestId("closeButton");
        this.fieldWrapper = this.field.locator("../..");
        this.errorBlock = this.section.locator(`text=${FIELDS_ERRORS.EMPTY}`);
        this.searchResults = this.fieldWrapper.getByTestId(
            "item-customSelectWithSearch",
        );
        this.firstResult = this.searchResults.first();
        this.missingResults = this.page.getByTestId("p2-notFound-addNewItem");
    }

    async selectManufacturer(): Promise<void> {
        await this.firstResult.click();
    }

    async typeManufacturer(str: string): Promise<void> {
        await super.typeIntoField(this.field, str);
    }

    async clearManufacturerField(): Promise<void> {
        if (await this.clearButton.isVisible()) await this.clearButton.click();
        else await super.clearTheField(this.field);
    }
}
