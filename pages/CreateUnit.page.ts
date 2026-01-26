import { Locator, Page } from "@playwright/test";
import BasePage from "./t-Base.page";
import { CREATE_UNIT_CONSTS } from "../constants/create-unit/createUnit.constants";
import { data, TabNumber, TestAdData } from "../types/tabs";
import { TAB_NUMBERS } from "../constants/create-unit/createUnit.constants";

type TabInfo = {
    title: string;
    number: string;
};

export class CreateUnitPage extends BasePage {
    readonly pageTitle: Locator;
    readonly tabList: Locator;
    readonly nextButton: Locator;
    readonly cancelButton: Locator;
    readonly successfullCreating: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = this.page
            .getByText(CREATE_UNIT_CONSTS.PAGE_TITLE)
            .first();
        this.tabList = this.page.locator('[role="tablist"] > button');
        this.nextButton = this.page.getByTestId("nextButton");
        this.cancelButton = this.page.getByTestId("prevButton");
        this.successfullCreating = this.page.getByText(
            "Ваше оголошення подане на розгляд",
        );
    }

    async getTabMetaInfo(tabNumber: TabNumber): Promise<TabInfo> {
        const index = TAB_NUMBERS.indexOf(tabNumber);
        if (index === -1)
            throw new Error(`The “${tabNumber}” tab key is not found`);

        const tab = this.tabList.nth(index);
        const number = await tab
            .locator("span", { hasText: tabNumber })
            .textContent();
        const title = await tab
            .locator("span", {
                hasText: data.tabs[tabNumber].title,
            })
            .textContent();

        return {
            number: number?.trim() ?? "",
            title: title?.trim() ?? "",
        };
    }

    async nextStep() {
        await this.nextButton.click();
    }

    async cancelAdCreating() {
        await this.cancelButton.click();
    }
}
