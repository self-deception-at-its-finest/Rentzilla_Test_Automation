import { Page, Locator } from "@playwright/test";
import {HeaderComponent} from "./Header.component";
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
    readonly emptyOrInvalidEmailFieldMsg: Locator;
    readonly emptyOrInvalidPasswordFieldMsg: Locator;
    readonly invalidEmailOrPasswordMsg: Locator;

    constructor(page: Page) {
        this.page = page;
        this.authContainer = page.getByTestId("authorizationContainer");
        this.authTitle = page.getByTestId("authorizationTitle");
        this.authCloseButton = page.getByTestId("authClose");
        this.emailInput = page.locator("input#email");
        this.passwordInput = page.locator("input#password");
        this.submitButton = page.getByRole('button', { name: 'Увійти', exact: true });
        this.showPasswordButton = this.passwordInput.locator("..").getByTestId('reactHookButton');
        this.invalidEmailOrPasswordMsg= page.getByTestId("errorMessage");
        this.emptyOrInvalidEmailFieldMsg = this.emailInput.locator("..").locator("..").locator("p");
        this.emptyOrInvalidPasswordFieldMsg = this.passwordInput.locator("..").locator("..").locator("p");
    }

    async login(creds?: {email?: string; password?: string}) {
        const headerComponent = new HeaderComponent(this.page);

        await headerComponent.authenticationButton.click();

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