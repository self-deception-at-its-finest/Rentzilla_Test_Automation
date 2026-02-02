import { Locator, Page } from "@playwright/test";

export class ServicesComponent {
    readonly page: Page;
    readonly section: Locator;
    readonly title: Locator;
    readonly tabs: Locator;
    readonly serviceItems: Locator;
    readonly logo: Locator;

    constructor(page: Page) {
        this.page = page;
        this.section = page.locator('section[data-testid="services"]');
        this.title = this.section.locator('[data-testid="title"]');
        this.tabs = this.section.getByTestId(/^services__/);
        this.serviceItems = this.section.getByTestId(/^service__/);
        this.logo = page.locator('[data-testid="logo"]');
    }

    async scrollToSection() {
        await this.section.scrollIntoViewIfNeeded();
    }
}