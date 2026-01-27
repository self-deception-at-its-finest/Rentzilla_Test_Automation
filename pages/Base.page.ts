import { expect, type Locator, type Page } from '@playwright/test';


export default class BasePage {
    readonly page: Page;
    public endpoint = '';

    constructor(page: Page) {
        this.page = page;
    }

    /**
     *
     * @param path
     */
    async open(path = ''): Promise<void> {
        await this.page.goto('/' + path, {
            waitUntil: 'domcontentloaded',
        });
    }
}