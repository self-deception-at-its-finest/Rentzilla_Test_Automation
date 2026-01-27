import { Page, Locator } from '@playwright/test';


export class HeaderComponent {
    readonly page: Page;
    readonly authenticationButton: Locator;
    readonly avatarBlock  : Locator;
    readonly profileDropdown : Locator;
    readonly profileDropdownEmail : Locator;
    readonly profileDropdownLogoutButton : Locator;

    constructor(page: Page) {
        this.page = page;
        this.authenticationButton = page.getByText("Вхід");
        this.avatarBlock = page.getByTestId("avatarBlock");
        this.profileDropdown = page.getByTestId("profileDropdown");
        this.profileDropdownEmail = page.getByTestId("profileDropdown").getByTestId("email")
        this.profileDropdownLogoutButton = page.getByTestId("profileDropdown").getByTestId("logout")
    }
    async openProfileDropdown() {
        await this.avatarBlock.click();
    }
}
