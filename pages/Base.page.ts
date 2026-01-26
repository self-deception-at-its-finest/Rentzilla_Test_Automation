import { expect, type Locator, type Page } from '@playwright/test';


export default class BasePage {
    public page: Page;
    public endpoint = '';

    constructor(page: Page) {
        this.page = page;
    }

    /**
     *
     * @param path
     */
    async open(path = ''): Promise<void> {
        await this.page.goto('/' + path);
    }
}
