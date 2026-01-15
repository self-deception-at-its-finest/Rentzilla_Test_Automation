import { expect, type Locator, type Page } from "@playwright/test";

export default class BasePage {
    private readonly page: Page;
    protected endpoint = "";

    constructor(page: Page) {
        this.page = page;
    }

    /**
     * Opens the page with the given path.
     * @param path
     */
    async open(path: string = ""): Promise<void> {
        await this.page.goto("/" + path);
    }
}