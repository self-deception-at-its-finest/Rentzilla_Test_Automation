import { Locator, Page } from "@playwright/test";
import BasePage from "./Base.page";
import { CREATE_UNIT_CONSTS } from "../constants/create-unit/createUnit.constants";
import { data, TabNumber } from "../types/tabs";
import { TAB_NUMBERS } from "../constants/create-unit/createUnit.constants";

type TabInfo = {
    title: string;
    number: string;
};

export class CreateUnitPage extends BasePage {
    readonly pageTitle: Locator;
    readonly tabList: Locator;
    readonly nextButton: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.getByText(CREATE_UNIT_CONSTS.PAGE_TITLE).first();
        this.tabList = page.locator('[role="tablist"] > button');
        this.nextButton = page.getByTestId("nextButton");
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

    async clickNextButton() {
        await this.nextButton.click();
    }
}
