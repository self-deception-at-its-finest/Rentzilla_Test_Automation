import { Locator, Page } from "@playwright/test";
import createUnitConstsJSON from "../../../constants/create-unit/create-unit.constants.json";
import { isDesktop } from "../../../utils/viewport-guard";

export class CategoryComponent {
    readonly page: Page;
    readonly section: Locator;
    readonly label: Locator;
    readonly requiredSymbol: Locator;
    readonly field: Locator;
    readonly fieldPlaceholder: Locator;
    readonly fieldArrow: Locator;
    readonly errorBlock: Locator;

    readonly popup: Locator;
    readonly popupTitle: Locator;
    readonly popupCloseBtn: Locator;
    readonly popupOutside: Locator;

    readonly firstCategoryList: Locator;
    readonly firstCategory: Locator;
    readonly secondCategoryList: Locator;
    readonly secondCategory: Locator;
    readonly thirdCategoryList: Locator;
    readonly thirdCategory: Locator;

    constructor(page: Page) {
        this.page = page;

        this.section = this.page
            .getByText(createUnitConstsJSON["tabs"]["1"]["category"]["label"])
            .locator("..");

        this.label = this.section.getByText(
            new RegExp(
                `^${createUnitConstsJSON["tabs"]["1"]["category"]["label"]}.*`,
            ),
        );
        this.requiredSymbol = this.section.locator("span", {
            hasText: "*",
        });
        this.field = this.section.getByTestId("buttonDiv");
        this.fieldPlaceholder = this.field.getByTestId("categoryName");
        this.fieldArrow = this.field.locator("img[alt='Arrow-down']");
        this.errorBlock = this.section.locator(
            `text=${createUnitConstsJSON["error messages"]["empty"]}`,
        );

        this.popup = this.page.getByTestId("categoryPopupWrapper");
        this.popupTitle = this.popup.locator(
            `text=${
                isDesktop(this.page)
                    ? createUnitConstsJSON["tabs"]["1"]["category"][
                          "popup title"
                      ]
                    : createUnitConstsJSON["tabs"]["1"]["category"][
                          "mobile popup title"
                      ]
            }`,
        );
        this.popupCloseBtn = this.popup.getByTestId("closeIcon");
        this.popupOutside = this.page.getByTestId("categoryPopup");

        // Select the particular category
        this.firstCategoryList = this.page.getByTestId("firstCategoryList");
        this.firstCategory = this.page
            .getByTestId("firstCategoryWrapper")
            .first();
        this.secondCategoryList = this.firstCategoryList.locator("+ div");
        this.secondCategory = this.page.getByTestId("list__burovi-ustanovki");
        this.thirdCategoryList = this.secondCategoryList.locator("+ div");
        this.thirdCategory = this.page.getByTestId("list__palebiini-ustanovki");
    }

    async selectFirstCategory() {
        await this.firstCategory.click();
    }

    async selectSecondCategory() {
        await this.secondCategory.click();
    }

    async selectThirdCategory() {
        await this.thirdCategory.click();
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
