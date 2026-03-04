import type { Locator, Page } from "@playwright/test";
import { tabs } from "../../../constants/create-unit/fields.constants";
import { FieldActions } from "../FieldActions";

export class PriceComponent {
    readonly page: Page;
    readonly priceField: Locator;
    readonly servicePriceField: Locator;
    readonly paymentMethodDropdown: Locator;
    readonly servicePriceTypeDropdown: Locator;
    readonly serviceShiftDropdown: Locator;
    readonly selectedPaymentMethod: Locator;
    readonly selectedServicePriceType: Locator;
    readonly selectedShift: Locator;
    readonly dropdownItemsContainer: Locator;
    readonly allDropdownItems: Locator;
    readonly paymentLabel: Locator;
    readonly paymentRequiredSymbol: Locator;
    readonly priceLabel: Locator;
    readonly priceRequiredSymbol: Locator;
    readonly priceCurrencyField: Locator;
    readonly servicePriceLabel: Locator;
    readonly servicePriceDesc: Locator;
    readonly servicePriceRequiredSymbol: Locator;
    readonly servicePriceCurrencyField: Locator;

    readonly selectedServicesSection: Locator;
    readonly selectedServicesList: Locator;

    readonly requiredMessage: Locator;

    private readonly fieldActions: FieldActions;

    constructor(page: Page) {
        this.page = page;

        this.requiredMessage = this.page
            .getByTestId("div_required_RowUnitPrice")
            .first();

        this.priceField = this.page
            .getByPlaceholder(tabs.price.fieldPlaceholder)
            .first();
        this.servicePriceField = this.page
            .getByPlaceholder(tabs.price.fieldPlaceholder)
            .last();

        this.paymentMethodDropdown = this.page
            .getByTestId("div_CustomSelect")
            .first();
        this.servicePriceTypeDropdown = this.page
            .getByTestId("div_CustomSelect")
            .nth(1);
        this.serviceShiftDropdown = this.page
            .getByTestId("div_CustomSelect")
            .last();
        this.selectedPaymentMethod = this.paymentMethodDropdown.locator(
            "> span:first-of-type",
        );
        this.selectedServicePriceType = this.servicePriceTypeDropdown.locator(
            "> span:first-of-type",
        );
        this.selectedShift = this.serviceShiftDropdown.locator(
            "> span:first-of-type",
        );

        this.dropdownItemsContainer = this.page.getByTestId(
            "listItems-customSelect",
        );
        this.allDropdownItems =
            this.dropdownItemsContainer.getByTestId("item-customSelect");

        this.paymentLabel = this.page.getByText(tabs.price.paymentLabel);
        this.paymentRequiredSymbol = this.paymentLabel.locator("span");
        this.priceLabel = this.page.getByText(tabs.price.priceLabel);
        this.priceRequiredSymbol = this.priceLabel.locator("span");

        this.priceCurrencyField = this.page
            .locator('input[value="UAH"]')
            .first();
        this.servicePriceCurrencyField = this.page
            .locator('input[value="UAH"]')
            .last();

        this.servicePriceLabel = this.page.getByTestId(
            "div_servicePrices_PricesUnitFlow",
        );
        this.servicePriceRequiredSymbol =
            this.servicePriceLabel.locator("span");
        this.servicePriceDesc = this.page.getByText(
            tabs.price.servicePriceDesc,
        );

        this.selectedServicesSection = this.servicePriceLabel.locator(
            " ~ div:last-of-type",
        );
        this.selectedServicesList = this.page.getByTestId("div_ServicePrice");

        this.fieldActions = new FieldActions(this.page);
    }

    // TODO create the dynamical price
    // static price for now
    async typePrice(price: string, field: Locator = this.priceField) {
        await this.fieldActions.typeIntoField(field, price);
    }

    async fillPrice(price: string, field: Locator = this.priceField) {
        await this.fieldActions.fillInField(field, price);
    }

    async clearPriceField(field: Locator = this.priceField) {
        await this.fieldActions.clearField(field);
    }

    private async isDropdownOpen(): Promise<boolean> {
        return await this.dropdownItemsContainer.isVisible();
    }

    private async openDropdown(dropdown: Locator) {
        if (!(await this.isDropdownOpen())) {
            await dropdown.click();
        }
    }

    private async closeDropdown(dropdown: Locator) {
        if (await this.isDropdownOpen()) {
            await dropdown.click();
        }
    }

    async openPaymentMethodDropdown() {
        await this.openDropdown(this.paymentMethodDropdown);
    }

    async closePaymentMethodDropdown() {
        await this.closeDropdown(this.paymentMethodDropdown);
    }

    async openServicePriceTypeDropdown() {
        await this.openDropdown(this.servicePriceTypeDropdown);
    }

    async closeServicePriceTypeDropdown() {
        await this.closeDropdown(this.servicePriceTypeDropdown);
    }

    async openServiceShiftDropdown() {
        await this.openDropdown(this.serviceShiftDropdown);
    }

    async closeServiceShiftDropdown() {
        await this.closeDropdown(this.serviceShiftDropdown);
    }

    getPathElement(element: Locator) {
        return element.locator("svg > path");
    }

    getAddServicePriceButton(
        service: Locator = this.selectedServicesList.first(),
    ) {
        return service.getByTestId("addPriceButton_ServicePrice");
    }

    async chooseItem(element: Locator) {
        await element.click();
    }

    async removeServicePrice() {
        await this.page
            .getByTestId("div_removePrice_RowUnitPrice")
            .first()
            .click();
    }

    getPriceFieldWrapper() {
        return this.priceField.locator("..");
    }
}
