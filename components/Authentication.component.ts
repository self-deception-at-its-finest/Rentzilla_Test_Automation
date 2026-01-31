import { Page, Locator } from "@playwright/test";
import { HeaderComponent } from "./Header.component";
import { expect } from "playwright/test";
import { MobNavbarComponent } from "./MobNavbar.component";
import { isDesktop } from "../utils/viewportGuard";

export class AuthenticationComponent {
    readonly page: Page;
    readonly authContainer: Locator;
    readonly authTitle: Locator;
    readonly authCloseButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;

    // Admin version of fields
    // because of ugly front-end code
    readonly adminAuthContainer: Locator;
    readonly adminAuthTitle: Locator;
    readonly adminAuthCloseButton: Locator;
    readonly adminEmailInput: Locator;
    readonly adminPasswordInput: Locator;
    readonly adminSubmitButton: Locator;

    readonly profileButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.authContainer = this.page.getByTestId("authorizationContainer");
        this.authTitle = this.authContainer.getByTestId("authorizationTitle");
        this.authCloseButton = this.authContainer.getByTestId("authClose");
        this.emailInput = this.authContainer.locator("input#email");
        this.passwordInput = this.authContainer.locator("input#password");
        this.submitButton = this.authContainer.getByRole("button", {
            name: "Увійти",
            exact: true,
        });

        // Admin version
        // because of ugly front-end code
        this.adminAuthContainer = this.page
            .getByTestId("authorizationContainer")
            .nth(1);
        this.adminAuthTitle =
            this.adminAuthContainer.getByTestId("authorizationTitle");
        this.adminAuthCloseButton =
            this.adminAuthContainer.getByTestId("authClose");
        this.adminEmailInput = this.adminAuthContainer.locator("input#email");
        this.adminPasswordInput =
            this.adminAuthContainer.locator("input#password");
        this.adminSubmitButton = this.adminAuthContainer.getByRole("button", {
            name: "Увійти",
            exact: true,
        });

        this.profileButton = this.page.getByText("Профіль");
    }

    async fillEmail(email: string) {
        await this.emailInput.fill(email);
    }

    async fillPassword(password: string) {
        await this.passwordInput.fill(password);
    }

    async login(creds?: { email?: string; password?: string }) {
        const { email, password } = creds ?? {};
        if (isDesktop(this.page)) {
            await new HeaderComponent(this.page).authenticationButton.click();
        } else {
            await new MobNavbarComponent(this.page).clickProfileBtn();
        }
        await expect(this.authContainer).toBeVisible();

        if (email !== undefined) await this.fillEmail(email);
        if (password !== undefined) await this.fillPassword(password);
        await this.submitButton.click();

        // Wait for the authentication container to disappear,
        // otherwise test fails.
        await this.authContainer.waitFor({ state: "hidden" });
    }

    async loginAsAdmin(creds?: { email?: string; password?: string }) {
        const { email, password } = creds ?? {};

        if (email !== undefined) {
            await this.adminEmailInput.fill(email);
        }
        if (password !== undefined) {
            await this.adminPasswordInput.fill(password);
        }
        await this.adminSubmitButton.click();

        // Wait for the authentication container to disappear,
        // otherwise test fails.
        await this.adminAuthContainer.waitFor({ state: "hidden" });
    }

    async logout() {
        const headerComponent = new HeaderComponent(this.page);
        await headerComponent.clickAvatarBlock();
        await headerComponent.clickLogout();
    }
}
