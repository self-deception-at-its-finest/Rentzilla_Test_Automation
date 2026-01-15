import { Page, Locator } from "@playwright/test";
import { HeaderComponent } from "./header.component";
import { expect } from "playwright/test";

export class AuthenticationComponent {
    readonly page: Page;
    readonly authContainer: Locator;
    readonly authTitle: Locator;
    readonly authCloseButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.authContainer = page.getByTestId("authorizationContainer");
        this.authTitle = page.getByTestId("authorizationTitle");
        this.authCloseButton = page.getByTestId("authClose");
        this.emailInput = page.locator("input#email");
        this.passwordInput = page.locator("input#password");
        this.submitButton = page.getByRole("button", {
            name: "Увійти",
            exact: true,
        });
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async login(creds?: { email?: string; password?: string }) {
        const headerComponent = new HeaderComponent(this.page);

        await headerComponent.authenticationButton.click();
        await expect(this.authContainer).toBeVisible();

        const { email, password } = creds ?? {};
        if (email !== undefined) await this.fillEmail(email);
        if (password !== undefined) await this.fillPassword(password);
        await this.submitButton.click();

        // Wait for the authentication container to disappear,
        // otherwise test fails.
        await this.authContainer.waitFor({ state: "hidden" });
    }
}
