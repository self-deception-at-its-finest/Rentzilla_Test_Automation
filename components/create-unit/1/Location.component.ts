import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./Base.component";
import { FIELDS_ERRORS } from "../../../constants/create-unit/createUnit.constants";
import { firstTabFields } from "../../../constants/create-unit/fields.constants";

export class LocationComponent extends BaseComponent {
    readonly selectPlaceButton: Locator;
    readonly mapLabel: Locator;
    readonly addressInput: Locator;
    readonly confirmPlaceButton: Locator;
    readonly errorBlock: Locator;
    readonly modalWindow: Locator;
    readonly modalWindowTitle: Locator;
    readonly modalWindowCloseButton: Locator;
    readonly modalWindowCancelButton: Locator;
    readonly modalWindowAcceptButton: Locator;
    readonly modalWindowAddressLabel: Locator;

    constructor(page: Page) {
        super(page, "location");
        this.selectPlaceButton = this.section.getByRole("button");
        this.confirmPlaceButton = this.page
            .getByTestId("div-mapPopup")
            .getByRole("button", { name: "Підтвердити вибір" });
        this.addressInput = this.page.getByTestId("cityInput");
        this.mapLabel = this.section.getByTestId("mapLabel");
        this.errorBlock = this.section.getByText(
            FIELDS_ERRORS.MISSING_LOCATION,
        );
        this.modalWindow = this.page.getByTestId("mapPopup");
        this.modalWindowTitle = this.modalWindow.getByText(
            firstTabFields.location.modal.title,
        );
        this.modalWindowCloseButton = this.modalWindowTitle.locator("+ span");
        this.modalWindowCancelButton = this.modalWindow.getByRole("button", {
            name: firstTabFields.location.modal.cancel,
        });
        this.modalWindowAcceptButton = this.modalWindow.getByRole("button", {
            name: firstTabFields.location.modal.accept,
        });
        this.modalWindowAddressLabel = this.modalWindow.getByTestId("address");
    }

    async openTheMap() {
        await this.selectPlaceButton.click();
    }

    async confirmThePlace() {
        await this.confirmPlaceButton.click();
    }

    async closeTheMap() {
        await this.modalWindowCloseButton.click();
    }

    async selectLocation(city: string = "Київ, Україна") {
        await this.openTheMap();
        await this.confirmThePlace();
        await this.section.locator("label", { hasText: city }).waitFor({
            state: "visible",
        });
    }
}
