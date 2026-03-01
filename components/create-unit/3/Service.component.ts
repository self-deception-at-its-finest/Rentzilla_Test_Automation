import { Locator, Page } from "@playwright/test";
import { tabs } from "../../../constants/create-unit/fields.constants";

type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export class ServiceComponent {
    readonly page: Page;
    readonly title: Locator;
    readonly description: Locator;
    readonly addInfo: Locator;
    readonly searchResultSection: Locator;
    readonly field: Locator;
    readonly loupeIcon: Locator;
    readonly searchResultsContainer: Locator;
    readonly searchResults: Locator;
    readonly requiredSymbol: Locator;

    readonly selectedServicesSection: Locator;
    readonly selectedServicesSectionTitle: Locator;
    readonly selectedServices: Locator;

    readonly notFoundServiceText: Locator;
    readonly addServiceButton: Locator;
    readonly addServiceIcon: Locator;

    constructor(page: Page) {
        this.page = page;
        this.searchResultSection = this.page.getByTestId("searchResult");
        this.field = this.searchResultSection.getByRole("textbox");
        this.title = this.page.getByText(tabs.service.title);
        this.description = this.page.getByText(tabs.service.description);
        this.addInfo = this.page.getByTestId("add-info");
        this.requiredSymbol = this.description.locator("span");
        this.loupeIcon = this.searchResultSection.locator("svg");
        this.searchResultsContainer = this.page
            .getByTestId("searchItem-servicesUnitFlow")
            .locator("..");
        this.searchResults = this.page.getByTestId(
            "searchItem-servicesUnitFlow",
        );
        this.selectedServicesSection = this.page
            .getByTestId("item-servicesUnitFlow")
            .locator("..");
        this.selectedServicesSectionTitle = this.page.getByText(
            tabs.service.addedServicesTitle,
        );
        this.selectedServices = this.page.getByTestId("item-servicesUnitFlow");

        this.notFoundServiceText = this.searchResultSection.getByTestId(
            "p2-notFound-addNewItem",
        );
        this.addServiceButton =
            this.searchResultSection.getByTestId("btn-addNewItem");
        this.addServiceIcon = this.addServiceButton.getByTestId(
            "svg-plus-addNewItem",
        );
    }

    async getLoupeCoords(): Promise<BoundingBox | null> {
        return await this.loupeIcon.boundingBox();
    }

    async getFieldCoords(): Promise<BoundingBox | null> {
        return await this.field.boundingBox();
    }

    getRemoveIcon(locator: Locator) {
        return locator.getByTestId("remove-servicesUnitFlow");
    }

    getPathElement(element: Locator) {
        return element.locator("svg > path");
    }

    async typeService(str: string) {
        await this.field.click();
        await this.page.keyboard.type(str);
    }

    async fillField(str: string) {
        await this.field.fill(str);
    }

    async selectService(num: number = 0) {
        await this.searchResults.nth(num).scrollIntoViewIfNeeded();
        await this.searchResults.nth(num).click();
    }

    async typeAndSelectService(str: string) {
        await this.typeService(str);
        if (await this.searchResultsContainer.isVisible())
            await this.selectService();
    }

    async clearField() {
        await this.field.clear();
    }
}
