import type { Locator, Page } from "@playwright/test";
import { BaseComponent } from "./Base.component";
import { tabs } from "@constants/create-unit/fields.constants";

export class NewUserContactsComponent extends BaseComponent {
	readonly mainInfoContainer: Locator;
	readonly customerInfoTypeContainer: Locator;
	readonly customerTypeSection: Locator;
	readonly customerTypeLabel: Locator;
	readonly customerTypeDropdown: Locator;
	readonly customerTypeListContainer: Locator;
	readonly customerTypeListItems: Locator;

	readonly customerTinSection: Locator;
	readonly customerTinLabel: Locator;
	readonly customerTinInput: Locator;
	readonly customerTinInputErrorText: Locator;
	readonly customerTinDescription: Locator;

	readonly legalTypeDropdownLabel: Locator;
	readonly legalTypeDropdown: Locator;
	readonly legalTypeListContainer: Locator;
	readonly legalTypeListItems: Locator;
	readonly legalNumberSection: Locator;
	readonly legalNumberLabel: Locator;
	readonly legalNumberInput: Locator;
	readonly legalNumberError: Locator;
	readonly legalNameSection: Locator;
	readonly legalNameLabel: Locator;
	readonly legalNameInput: Locator;
	readonly legalNameError: Locator;

	readonly customerFirstNameSection: Locator;
	readonly customerFirstNameLabel: Locator;
	readonly customerFirstNameInput: Locator;
	readonly customerFirstNameError: Locator;
	readonly customerLastNameSection: Locator;
	readonly customerLastNameLabel: Locator;
	readonly customerLastNameInput: Locator;
	readonly customerLastNameError: Locator;
	readonly customerPatronymicSection: Locator;
	readonly customerPatronymicLabel: Locator;
	readonly customerPatronymicInput: Locator;
	readonly customerPatronymicError: Locator;
	readonly customerCitySection: Locator;

	readonly contactsContainer: Locator;
	readonly contactsLabel: Locator;
	readonly ownerProfileNumberContainer: Locator;
	readonly phoneNumberSection: Locator;
	readonly phoneNumberInputLabel: Locator;
	readonly phoneNumberInput: Locator;
	readonly verificationSection: Locator;
	readonly verificationLabel: Locator;
	readonly verificationTelegramButton: Locator;
	readonly verificatioSmsButton: Locator;
	readonly messengersContainer: Locator;
	readonly viberSection: Locator;
	readonly viberLabel: Locator;
	readonly viberInput: Locator;
	readonly viberError: Locator;
	readonly telegramSection: Locator;
	readonly telegramLabel: Locator;
	readonly telegramInput: Locator;
	readonly telegramError: Locator;
	readonly emailSection: Locator;
	readonly emailLabel: Locator;
	readonly emailInput: Locator;

	constructor(page: Page) {
		super(page);
		this.mainInfoContainer = this.page.getByText(tabs.contacts.mainInfoLabel).locator("..");
		this.customerInfoTypeContainer = this.mainInfoContainer.getByTestId("wrapper_OwnerProfileLegalType");
		this.customerTypeSection = this.customerInfoTypeContainer.locator("div").first().locator("div");
		this.customerTypeLabel = this.customerTypeSection.getByText(tabs.contacts.userTypeLabel);
		this.customerTypeDropdown = this.customerTypeSection.getByTestId("div_CustomSelect").first();
		this.customerTypeListContainer = this.customerTypeSection.getByTestId("listItems-customSelect");
		this.customerTypeListItems = this.customerTypeListContainer.getByTestId("item-customSelect");

		this.customerTinSection = this.customerInfoTypeContainer.getByTestId("customInputWrapper").first();
		this.customerTinLabel = this.customerTinSection.locator("div").first();
		this.customerTinInput = this.customerTinSection.getByTestId("custom-input");
		this.customerTinDescription = this.customerInfoTypeContainer
			.locator("../..")
			.getByText(tabs.contacts.tinDescription);
		this.customerTinInputErrorText = this.customerTinSection.getByTestId("descriptionError").first();

		this.legalTypeDropdownLabel = this.mainInfoContainer.getByText(tabs.contacts.legalTypeLabel);
		this.legalTypeDropdown = this.customerTypeSection.getByTestId("div_CustomSelect").last();
		this.legalTypeListContainer = this.customerTypeSection.getByTestId("listItems-customSelect");
		this.legalTypeListItems = this.legalTypeListContainer.getByTestId("item-customSelect");
		this.legalNumberSection = this.customerInfoTypeContainer
			.getByTestId("customInputWrapper")
			.filter({ hasText: tabs.contacts.legalNumberLabel });
		this.legalNumberLabel = this.legalNumberSection.getByText(tabs.contacts.legalNumberLabel);
		this.legalNumberInput = this.legalNumberSection.getByRole("textbox");
		this.legalNumberError = this.legalNumberSection.getByTestId("descriptionError");

		this.legalNameSection = this.customerInfoTypeContainer
			.getByTestId("customInputWrapper")
			.filter({ hasText: tabs.contacts.legalNameLabel });
		this.legalNameLabel = this.legalNameSection.getByText(tabs.contacts.legalNameLabel);
		this.legalNameInput = this.legalNameSection.getByRole("textbox");
		this.legalNameError = this.legalNameSection.getByTestId("descriptionError");

		this.customerFirstNameSection = this.mainInfoContainer
			.getByTestId("customInputWrapper")
			.filter({ hasText: tabs.contacts.firstNameLabel });
		this.customerFirstNameLabel = this.customerFirstNameSection.getByText(tabs.contacts.firstNameLabel);
		this.customerFirstNameInput = this.customerFirstNameSection.getByRole("textbox");
		this.customerFirstNameError = this.customerFirstNameSection.getByTestId("descriptionError");

		this.customerLastNameSection = this.mainInfoContainer
			.getByTestId("customInputWrapper")
			.filter({ hasText: tabs.contacts.lastNameLabel });
		this.customerLastNameLabel = this.customerLastNameSection.getByText(tabs.contacts.lastNameLabel);
		this.customerLastNameInput = this.customerLastNameSection.getByRole("textbox");
		this.customerLastNameError = this.customerLastNameSection.getByTestId("descriptionError");

		this.customerPatronymicSection = this.mainInfoContainer
			.getByTestId("customInputWrapper")
			.filter({ hasText: tabs.contacts.patronymicLabel });
		this.customerPatronymicLabel = this.customerPatronymicSection.getByText(tabs.contacts.patronymicLabel);
		this.customerPatronymicInput = this.customerPatronymicSection.getByRole("textbox");
		this.customerPatronymicError = this.customerPatronymicSection.getByTestId("descriptionError");

		this.customerCitySection = this.mainInfoContainer
			.getByTestId("OwnerProfileCity")
			.getByTestId("customInputWrapper");

		this.contactsContainer = this.page.getByText(tabs.contacts.yourContactsLabel).locator("..");
		this.contactsLabel = this.contactsContainer.getByText(tabs.contacts.yourContactsLabel);
		this.ownerProfileNumberContainer = this.contactsContainer.getByTestId("OwnerProfileNumber");
		this.phoneNumberSection = this.ownerProfileNumberContainer.getByTestId("inputWrapper_OwnerProfileNumber");
		this.phoneNumberInputLabel = this.phoneNumberSection.locator("> div").first();
		this.phoneNumberInput = this.phoneNumberSection.getByTestId("input_OwnerProfileNumber");
		this.verificationSection = this.ownerProfileNumberContainer.locator("div").last();
		this.verificationLabel = this.verificationSection.locator("div").first();
		this.verificatioSmsButton = this.verificationSection.getByTestId("smsButton_OwnerProfileNumber");
		this.verificationTelegramButton = this.verificationSection.getByTestId("telegramButton_OwnerProfileNumber");

		this.messengersContainer = this.page.getByTestId("OwnerProfileAdditionalInfo");

		this.viberSection = this.messengersContainer.getByText(tabs.contacts.viberLabel).locator("..");
		this.viberLabel = this.viberSection.getByText(tabs.contacts.viberLabel);
		this.viberInput = this.viberSection.getByRole("textbox");
		this.viberError = this.viberInput.locator(" ~ div");

		this.telegramSection = this.messengersContainer
			.getByTestId("customInputWrapper")
			.filter({ hasText: tabs.contacts.telegramLabel });
		this.telegramLabel = this.telegramSection.getByText(tabs.contacts.telegramLabel);
		this.telegramInput = this.telegramSection.getByRole("textbox");
		this.telegramError = this.telegramSection.getByTestId("descriptionError");

		this.emailSection = this.contactsContainer.getByTestId("OwnerProfileEmail").locator("> div").first();
		this.emailLabel = this.emailSection.locator("> div").first();
		this.emailInput = this.emailSection.getByTestId("custom-input");
	}

	private async isDropdownVisible(container: Locator): Promise<boolean> {
		return container.isVisible();
	}

	async openCustomerTypeDropdown() {
		if (!(await this.isDropdownVisible(this.customerTypeListContainer))) await this.customerTypeDropdown.click();
	}

	async closeCustomerTypeDropdown() {
		if (await this.isDropdownVisible(this.customerTypeListContainer)) await this.customerTypeDropdown.click();
	}

	async openLegalTypeDropdown() {
		if (!(await this.isDropdownVisible(this.legalTypeListContainer))) await this.legalTypeDropdown.click();
	}

	async closeLegalTypeDropdown() {
		if (await this.isDropdownVisible(this.legalTypeListContainer)) await this.legalTypeDropdown.click();
	}

	async chooseCustomerType(type: string) {
		await this.chooseItemInDropdown(this.customerTypeListItems.filter({ hasText: type }).first());
	}

	async chooseLegalType(type: string) {
		await this.chooseItemInDropdown(this.legalTypeListItems.filter({ hasText: type }).first());
	}
}
