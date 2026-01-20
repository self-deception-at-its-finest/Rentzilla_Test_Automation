import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";
import {
    createUnitConsts,
    tabNumbers,
    Tab,
    data,
} from "../constants/create-unit/create-unit.constants";

type TabInfo = {
    tabTitle: string;
    tabNumber: string;
};

export class CreateUnitPage extends BasePage {
    readonly pageTitle: Locator;
    readonly tabList: Locator;
    readonly nextButton: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.getByText(createUnitConsts.PAGE_TITLE).first();
        this.tabList = page.locator('[role="tablist"] > button');

        this.nextButton = page.getByTestId("nextButton");
    }

    async getTabMetaInfo(tabNumber: Tab): Promise<TabInfo> {
        const index = tabNumbers.indexOf(tabNumber);
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
            tabNumber: number?.trim() ?? "",
            tabTitle: title?.trim() ?? "",
        };
    }

    async clickNextButton() {
        await this.nextButton.click();
    }
}
