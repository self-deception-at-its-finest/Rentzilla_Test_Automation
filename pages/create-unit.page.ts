import { Locator, Page, expect, test } from "@playwright/test";
import BasePage from "./base.page";
import createUnitConstants from "../constants/create-unit.constants.json";

type TabInfo = {
    title: string;
    number: string;
};

export class CreateUnitPage extends BasePage {
    readonly pageTitle: Locator;
    readonly tabList: Locator;
    readonly tabNumbers: (keyof typeof createUnitConstants.tabs)[];

    constructor(page: Page) {
        super(page);
        this.pageTitle = page
            .getByText(createUnitConstants["page title"])
            .first();
        this.tabList = page.locator('[role="tablist"] > button');

        this.tabNumbers = Object.keys(
            createUnitConstants.tabs
        ) as (keyof typeof createUnitConstants.tabs)[];
    }

    /**
     *
     * @param tabNumber - tab number as string
     * @returns
     */
    async getTabMetaInfo(
        tabNumber: keyof typeof createUnitConstants.tabs
    ): Promise<TabInfo> {
        const index = this.tabNumbers.indexOf(tabNumber);
        if (index === -1)
            throw new Error(`The “${tabNumber}” tab key is not found`);

        const tab = this.tabList.nth(index);
        const number = await tab
            .locator("span", { hasText: tabNumber })
            .textContent();
        const title = await tab
            .locator("span", {
                hasText: createUnitConstants.tabs[tabNumber].title,
            })
            .textContent();

        return {
            number: number?.trim() ?? "",
            title: title?.trim() ?? "",
        };
    }
}
