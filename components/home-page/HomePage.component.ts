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
        this.tabs = this.section.locator('.RentzilaProposes_service__oHepD');
        this.serviceItems = this.section.locator('.RentzilaProposes_proposes_item__sY_h2');
        this.logo = page.locator('[data-testid="logo"]');
    }

    async scrollToSection() {
        await this.section.scrollIntoViewIfNeeded();
    }
}