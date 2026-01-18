import { Locator, Page } from "@playwright/test";
import createUnitConsts from "../../../constants/create-unit.constants.json";

export class MainInfoComponent {
    readonly borderColor = "rgb(247, 56, 89)";

    readonly page: Page;

    readonly categorySection: Locator;
    readonly label: Locator;
    readonly requiredSymbol: Locator;
    readonly field: Locator;
    readonly fieldPlaceholder: Locator;
    readonly fieldArrow: Locator;
    readonly errorBlock: Locator;

    readonly categoryPopup: Locator;
    readonly popupTitle: Locator;
    readonly popupCloseBtn: Locator;
    readonly popupOutside: Locator;

    constructor(page: Page) {
        this.page = page;

        this.categorySection = page
            .getByText(createUnitConsts["tabs"]["1"]["category"]["label"])
            .locator("..");

        this.label = this.categorySection.getByText(
            new RegExp(
                `^${createUnitConsts["tabs"]["1"]["category"]["label"]}.*`
            )
        );
        this.requiredSymbol = this.categorySection.locator("span", {
            hasText: "*",
        });
        this.field = this.categorySection.getByTestId("buttonDiv");
        this.fieldPlaceholder = this.field.getByTestId("categoryName");
        this.fieldArrow = this.field.locator("img[alt='Arrow-down']");
        this.errorBlock = this.categorySection.locator(
            `text=${createUnitConsts["error message"]}`
        );

        this.categoryPopup = page.getByTestId("categoryPopupWrapper");
        this.popupTitle = this.categoryPopup.locator(
            `text=${createUnitConsts["tabs"]["1"]["category"]["popup title"]}`
        );
        this.popupCloseBtn = this.categoryPopup.getByTestId("closeIcon");
        this.popupOutside = page.getByTestId("categoryPopup");
    }

    async clickCloseBtn() {
        await this.popupCloseBtn.click();
    }

    async clickPopupOutside() {
        await this.page.mouse.click(1, 1);
    }

    async clickCategorySelect() {
        await this.field.click();
    }
}
