import { Locator, Page } from "@playwright/test";
import { TestAdData } from "../types/tabs";

export class AdminPage {
    readonly page: Page;
    readonly adsLink: Locator;
    readonly servicesLink: Locator;
    readonly approveTab: Locator;
    readonly waitingTab: Locator;
    readonly dataSortColumn: Locator;
    readonly logoutButton: Locator;

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
        this.logoutButton = this.page.getByText("Вихід");

        this.servicesLink = this.page
            .getByTestId("linksContainer")
            .filter({ hasText: "Сервіси" });
    }

    async logout() {
        await this.logoutButton.click();
    }

    async approveAds(ads: TestAdData[]) {
        await this.adsLink.click();
        await this.waitingTab.click();
        for (let i = 0; i < ads.length; i++) {
            await this.page.getByTestId("input").fill(ads[i].title);

            let adRecord = this.page.locator("tr", {
                has: this.page.locator("td", { hasText: ads[i].title }),
            });

            await adRecord
                .getByTestId("adminShowButton")
                .scrollIntoViewIfNeeded();
            await adRecord.getByTestId("adminShowButton").click();
            await this.page.getByTestId("approveBtn").click();
        }
    }

    async deleteAds(ads: TestAdData[]) {
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
            await this.confirmDeleting();
        }
    }

    async removeService(service: string) {
        await this.openServicesList();
        await this.page.getByTestId("input").fill(service);
        const row = this.page
            .locator("tr")
            .filter({ hasText: service })
            .filter({ hasText: "Користувацькі" });

        await row.getByTestId("bucketBtn").click();
        await this.confirmDeleting();
        console.log("Successful removing!");
    }

    private async confirmDeleting() {
        await this.page
            .getByTestId("content")
            .getByRole("button", { name: "Так" })
            .click();
    }

    private async openServicesList() {
        await this.servicesLink.click();
        await this.page
            .getByText("Список сервісів")
            .waitFor({ state: "visible" });
        await this.page.getByText("Список сервісів").click();
    }
}
