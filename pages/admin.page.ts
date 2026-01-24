import { Locator, Page } from "@playwright/test";
import { TestAdData } from "../types/tabs";

export class AdminPage {
    readonly page: Page;
    readonly adsLink: Locator;
    readonly approveTab: Locator;
    readonly waitingTab: Locator;
    readonly dataSortColumn: Locator;

    constructor(page: Page) {
        this.page = page;
        this.adsLink = this.page
            .getByTestId("navigationContainer")
            .getByText("Оголошення");
        this.waitingTab = this.page
            .getByTestId("statusBtns")
            .getByText("Очікуючі");
        this.approveTab = this.page
            .getByTestId("statusBtns")
            .getByText("Активні");
        this.dataSortColumn = this.page
            .getByTestId("sortLabelContainer")
            .getByText("Дата створення");
    }

    async approveAds(ads: TestAdData[]) {
        // Click on the «Оголошення» menu
        await this.adsLink.click();
        await this.waitingTab.click();
        for (let i = 0; i < ads.length; i++) {
            await this.page.getByTestId("input").fill(ads[i].title);
            // Find the locator
            let adRecord = this.page.locator("tr", {
                has: this.page.locator("td", { hasText: ads[i].title }),
            });
            // Click on the "Show" green button
            await adRecord
                .getByTestId("adminShowButton")
                .scrollIntoViewIfNeeded();
            await adRecord.getByTestId("adminShowButton").click();
            await this.page.getByTestId("approveBtn").click();
        }
        console.log("Successfull aprroving!");
    }

    async deleteAds(ads: TestAdData[]) {
        // Click on the «Оголошення» menu
        await this.adsLink.click();
        await this.approveTab.click();
        for (let i = 0; i < ads.length; i++) {
            await this.page.getByTestId("input").fill(ads[i].title);
            let deleteBtn = this.page
                .locator("tr", {
                    has: this.page.locator("td", {
                        hasText: ads[i].title,
                    }),
                })
                .getByTestId("bucketBtn");
            await deleteBtn.click();
            await this.page
                .getByTestId("content")
                .getByRole("button", { name: "Так" })
                .click();
        }
        console.log("Successfull deleting!");
    }
}
