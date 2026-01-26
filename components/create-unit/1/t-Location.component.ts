import { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./t-Base.component";

export class LocationComponent extends BaseComponent {
    readonly selectPlaceButton: Locator;
    readonly mapLabel: Locator;
    readonly addressInput: Locator;
    readonly acceptPlaceButton: Locator;

    constructor(page: Page) {
        super(page, "location");
        this.selectPlaceButton = this.section.getByRole("button");
        this.acceptPlaceButton = this.page
            .getByTestId("div-mapPopup")
            .getByRole("button", { name: "Підтвердити вибір" });
        this.addressInput = this.page.getByTestId("cityInput");
        this.mapLabel = this.section.getByTestId("mapLabel");
    }

    async selectLocation(city: string = "Київ, Україна") {
        await this.selectPlaceButton.click();
        await this.acceptPlaceButton.click();
        await this.section.locator("label", { hasText: city }).waitFor({
            state: "visible",
        });
    }
}
