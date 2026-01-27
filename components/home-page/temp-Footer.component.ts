import { Locator, Page } from "@playwright/test";

export class FooterComponent {
    readonly page: Page;
    readonly container: Locator;
    readonly logo: Locator;
    readonly emailLink: Locator;
    readonly copyrightLabel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.container = page.locator('div[class*="Footer_footer"]').first(); 
        this.logo = this.container.locator('[data-testid="logo"]');
        this.emailLink = this.container.locator('a[href^="mailto:"]');
        this.copyrightLabel = this.container.locator('[data-testid="copyright"]');
    }

    getLinkByText(text: string): Locator {
        return this.container.locator('a', { hasText: text });
    }

    getLabelByText(text: string): Locator {
        return this.container.locator('div', { hasText: text }).first();
    }
}