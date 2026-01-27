import { Page, Locator } from "@playwright/test";
import {HeaderComponent} from "./header.component";
import {expect} from "playwright/test";
import errorMessages from '../constants/errorMessages.constants.json';


export class AuthenticationComponent {
    readonly page: Page;
    readonly authContainer: Locator;
    readonly authTitle: Locator;
    readonly authCloseButton: Locator;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly submitButton: Locator;
    readonly showPasswordButton: Locator;
    readonly invalidEmailFormatMsg: Locator;
    readonly invalidEmailOrPasswordMsg: Locator;
    readonly invalidPasswordFormatMsg: Locator;
    readonly emptyEmailFieldMsg: Locator;
    readonly emptyPasswordFieldMsg: Locator;
    readonly passwordLabel: Locator;
    readonly emailLabel: Locator;

    constructor(page: Page) {
        this.page = page;
        this.authContainer = page.getByTestId("authorizationContainer");
        this.authTitle = page.getByTestId("authorizationTitle");
        this.authCloseButton = page.getByTestId("authClose");
        this.emailInput = page.locator("input#email");
        this.passwordInput = page.locator("input#password");
        this.submitButton = page.getByRole('button', { name: 'Увійти', exact: true });
        this.showPasswordButton = this.passwordInput.locator("..").getByTestId('reactHookButton');
        this.invalidEmailFormatMsg = page.getByText(errorMessages.invalidEmailFormat);
        this.invalidPasswordFormatMsg = page.getByText(errorMessages.invalidPasswordFormat);
        this.invalidEmailOrPasswordMsg= page.getByTestId("errorMessage");
        this.passwordLabel = page.getByTestId("labelTitle").getByText("Пароль");
        this.emailLabel = page.getByTestId("labelTitle").getByText("E-mail або номер телефону");
        this.emptyEmailFieldMsg = this.emailLabel.locator("..").locator("p")
        this.emptyPasswordFieldMsg = this.passwordLabel.locator("..").locator("p")
    }

    async login(creds?: {email?: string; password?: string}) {
        const headerComponent = new HeaderComponent(this.page);

        await headerComponent.authenticationButton.click();
        await expect(this.authContainer).toBeVisible();

        const {email, password,} = creds ?? {};
        if(email !== undefined) await this.emailInput.fill(email);
        if(password !== undefined) await this.passwordInput.fill(password);
        await this.submitButton.click();
    }

    async openLoginForm() {
        const headerComponent = new HeaderComponent(this.page);
        await headerComponent.authenticationButton.click();
    }

    async fillCredentials(emailOrPhone: string, password: string) {
        await this.emailInput.fill(emailOrPhone);
        await this.passwordInput.fill(password);
    }

    async togglePasswordVisibility() {
        await this.showPasswordButton.click();
    }

    async submitRandomly() {
        const useEnter = Math.random() < 0.5;

        if (useEnter) {
            await this.passwordInput.press('Enter');
        } else {
            await this.submitButton.click();
        }
    }
}
