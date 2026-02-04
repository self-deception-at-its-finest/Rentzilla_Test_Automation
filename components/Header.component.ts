import { Page, Locator } from "@playwright/test";

export class HeaderComponent {
    readonly page: Page;
    readonly headerSection: Locator;
    // TODO `authenticationButton` should be moved to other component
    readonly authenticationButton: Locator;
    readonly avatarBlock: Locator;
    readonly createAdLink: Locator;
    readonly logoutLink: Locator;
    readonly profileDropdown : Locator;
    readonly profileDropdownEmail : Locator;
    readonly profileDropdownLogoutButton : Locator;

    constructor(page: Page) {
        this.page = page;
        this.headerSection = this.page.locator("header");
        this.authenticationButton = this.page.getByText("Вхід");
        this.avatarBlock = this.page.getByTestId("avatarBlock");
        this.logoutLink = this.page.locator("header").getByTestId("logout");
        this.createAdLink = this.headerSection.getByRole("link", {
            name: "Подати оголошення",
        });
        this.profileDropdown = page.getByTestId("profileDropdown");
        this.profileDropdownEmail = page.getByTestId("profileDropdown").getByTestId("email")
        this.profileDropdownLogoutButton = page.getByTestId("profileDropdown").getByTestId("logout")
    }

    async clickAvatarBlock() {
        await this.avatarBlock.click();
    }

    async clickLogout() {
        await this.logoutLink.click();
    }

    async clickCreateAdLink() {
        await this.createAdLink.click();
    }

    async openLoginForm() {
        await this.authenticationButton.click();
    }

    async openProfileDropdown() {
        await this.avatarBlock.click();
    }

}
