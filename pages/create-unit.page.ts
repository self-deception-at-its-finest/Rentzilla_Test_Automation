import { Locator, Page, expect, test } from "@playwright/test";
import BasePage from "./base.page";
import createUnitConsts from "../constants/create-unit.constants.json";

type TabInfo = {
    title: string;
    number: string;
};

export class CreateUnitPage extends BasePage {
    readonly pageTitle: Locator;
    readonly tabList: Locator;
    readonly tabNumbers: (keyof typeof createUnitConsts.tabs)[];
    readonly nextButton: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.getByText(createUnitConsts["page title"]).first();
        this.tabList = page.locator('[role="tablist"] > button');

        this.tabNumbers = Object.keys(
            createUnitConsts.tabs
        ) as (keyof typeof createUnitConsts.tabs)[];

        this.nextButton = page.getByTestId("nextButton");
    }

    async getTabMetaInfo(
        tabNumber: keyof typeof createUnitConsts.tabs
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
                hasText: createUnitConsts["tabs"][tabNumber]["title"],
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
