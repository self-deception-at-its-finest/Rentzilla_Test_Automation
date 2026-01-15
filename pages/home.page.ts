import { expect, type Locator, type Page } from "@playwright/test";
import BasePage from "./base.page";
import endpoints from "../constants/endpoints.constants.json";

export class HomePage extends BasePage {
    readonly servicesTitle: Locator;
    readonly servicesPopularni: Locator;
    readonly servicesSilskogospodarski: Locator;

    async checkTitleVisible() {
        await expect(this.servicesTitle).toBeVisible();
    }

    constructor(page: Page) {
        super(page);
        this.endpoint = endpoints.home;
        this.servicesTitle = page.getByTestId("services").getByTestId("title");
        this.servicesPopularni = page.getByTestId("services__populyarni");
        this.servicesSilskogospodarski = page.getByTestId(
            "services__silskogospodarski"
        );
    }

    async open(): Promise<void> {
        await super.open(this.endpoint);
    }
}
