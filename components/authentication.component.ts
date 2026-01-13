import { Page, Locator } from "@playwright/test"
import {HeaderComponent} from "./header.component"
import {expect} from "playwright/test"

export class AuthenticationComponent {
    public page: Page
    public authContainer: Locator
    public authTitle: Locator
    public authCloseButton: Locator
    public emailInput: Locator
    public passwordInput: Locator
    public submitButton: Locator

    constructor(page: Page) {
        this.page = page
        this.authContainer = page.getByTestId("authorizationContainer")
        this.authTitle = page.getByTestId("authorizationTitle")
        this.authCloseButton = page.getByTestId("authClose")
        this.emailInput = page.locator("input#email")
        this.passwordInput = page.locator("input#password")
        this.submitButton = page. getByRole('button', { name: 'Увійти', exact: true })
    }

    async login(creds?: {email?: string; password?: string}) {
        const headerComponent = new HeaderComponent(this.page)

        await headerComponent.authenticationButton.click()
        await expect(this.authContainer).toBeVisible()

        const {email, password,} = creds ?? {}
        if(email !== undefined) await this.emailInput.fill(email)
        if(password !== undefined) await this.passwordInput.fill(password)
        await this.submitButton.click()
    }
}