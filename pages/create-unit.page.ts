import { Locator, Page } from "@playwright/test";
import BasePage from "./base.page";
import createUnitConstsJSON from "../constants/create-unit/create-unit.constants.json";

type TabInfo = {
    title: string;
    number: string;
};

export class CreateUnitPage extends BasePage {
    readonly pageTitle: Locator;
    readonly tabList: Locator;
    readonly tabNumbers: (keyof typeof createUnitConstsJSON.tabs)[];
    readonly nextButton: Locator;

    constructor(page: Page) {
        super(page);
        this.pageTitle = page.getByText(createUnitConstsJSON["page title"]).first();
        this.tabList = page.locator('[role="tablist"] > button');

        this.tabNumbers = Object.keys(
            createUnitConstsJSON.tabs
        ) as (keyof typeof createUnitConstsJSON.tabs)[];

        this.nextButton = page.getByTestId("nextButton");
    }

    async getTabMetaInfo(
        tabNumber: keyof typeof createUnitConstsJSON.tabs
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
                hasText: createUnitConstsJSON["tabs"][tabNumber]["title"],
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
