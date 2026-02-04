import { Locator, Page } from "@playwright/test";
import { isDesktop } from "../../../utils/viewportGuard";
import { BaseComponent } from "./Base.component";
import { firstTabFields } from "../../../constants/create-unit/fields.constants";
import { FIELDS_ERRORS } from "../../../constants/create-unit/createUnit.constants";

export class CategoryComponent extends BaseComponent {
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
        super(page, "category");
        this.field = this.section.getByTestId("buttonDiv");
        this.fieldPlaceholder = this.field.getByTestId("categoryName");
        this.fieldArrow = this.field.locator("img[alt='Arrow-down']");
        this.errorBlock = this.section.locator(`text=${FIELDS_ERRORS.EMPTY}`);

        this.popup = this.page.getByTestId("categoryPopupWrapper");
        this.popupTitle = this.popup.locator(
            `text=${
                isDesktop(this.page)
                    ? firstTabFields.category.popupTitle
                    : firstTabFields.category.mobPopupTitle
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

    async clickCategorySelect() {
        await this.field.click();
    }

    /**
     * Entire flow selecting of category
     */
    async selectCategory() {
        await this.clickCategorySelect();
        await this.selectFirstCategory();
        await this.selectSecondCategory();
        await this.selectThirdCategory();
    }
}
