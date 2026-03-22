import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./Base.component";

export class VerifiedUserContactsComponent extends BaseComponent {
    readonly readonlyContactsSection: Locator;
    readonly yourContactsTitle: Locator;
    readonly userNameText: Locator;
    readonly tinText: Locator;
    readonly userPhoneText: Locator;
    readonly userEmailText: Locator;

    readonly photoImg: Locator;

    constructor(page: Page) {
        super(page);
        this.readonlyContactsSection = this.page.getByTestId("userInfo");
        this.yourContactsTitle = this.readonlyContactsSection.locator(
            " > div:first-of-type",
        );
        this.userNameText =
            this.readonlyContactsSection.getByTestId("userName");
        this.tinText = this.readonlyContactsSection.getByTestId("inn");
        this.userPhoneText = this.readonlyContactsSection
            .getByTestId("paragraphWithIcon")
            .first()
            .locator("> div:last-of-type");
        this.userEmailText = this.readonlyContactsSection
            .getByTestId("paragraphWithIcon")
            .last()
            .locator("> div:last-of-type");
        this.photoImg = this.readonlyContactsSection.getByTestId("photo");
    }
}
