import type { Locator, Page } from "@playwright/test";
import BasePage from "./Base.page";
import {
	BUTTONS,
	createUnitConsts,
	createUnitConsts as data,
	TabNumber,
} from "@constants/create-unit/createUnit.constants";
import { TAB_NUMBERS } from "@constants/create-unit/createUnit.constants";
import { PriceComponent } from "@components/create-unit/4/Price.component";
import { ServiceComponent } from "@components/create-unit/3/Service.component";
import { PhotosComponent } from "@components/create-unit/2/Photos.component";
import { MainInfoComponent as MainInfoComponent } from "@components/create-unit/1/MainInfo.component";
import { VerifiedUserContactsComponent } from "@components/create-unit/5/VerifiedUserContacts.component";
import { NewUserContactsComponent } from "@components/create-unit/5/NewUserContacts.component";

export class CreateUnitPage extends BasePage {
	readonly root: Locator;
	readonly pageTitle: Locator;
	readonly tabList: Locator;
	readonly nextButton: Locator;
	readonly cancelButton: Locator;
	readonly reviewAdButton: Locator;
	readonly successfullCreating: Locator;
	readonly notificationContainer: Locator;

	readonly mainInfoTab: MainInfoComponent;
	readonly photosTab: PhotosComponent;
	readonly serviceTab: ServiceComponent;
	readonly priceTab: PriceComponent;
	readonly verifiedUserContactsTab: VerifiedUserContactsComponent;
	readonly newUserContactsTab: NewUserContactsComponent;

	constructor(page: Page) {
		super(page);
		this.root = this.page.getByText(createUnitConsts.pageTitle).locator("..");
		this.pageTitle = this.page.getByText(data.pageTitle).first();
		this.tabList = this.page.locator('[role="tablist"] > button');
		this.nextButton = this.page.getByTestId("nextButton");
		this.cancelButton = this.page.getByTestId("prevButton");
		this.reviewAdButton = this.root.getByText(BUTTONS.REVIEW);
		this.successfullCreating = this.page.getByText(data.successfullCreatingMessage);

		this.mainInfoTab = new MainInfoComponent(this.page);
		this.photosTab = new PhotosComponent(this.page);
		this.serviceTab = new ServiceComponent(this.page);
		this.priceTab = new PriceComponent(this.page);

		this.verifiedUserContactsTab = new VerifiedUserContactsComponent(this.page);
		this.newUserContactsTab = new NewUserContactsComponent(this.page);

		this.notificationContainer = this.page.getByTestId("notificationContainer");
	}

	async getTabMetaInfo(tabNumber: TabNumber): Promise<{ title: string; number: string }> {
		const index = TAB_NUMBERS.indexOf(tabNumber);
		if (index === -1) throw new Error(`The “${tabNumber}” tab key is not found`);

		const tab = this.tabList.nth(index);
		const number = await tab.locator("span", { hasText: tabNumber }).textContent();
		const title = await tab
			.locator("span", {
				hasText: data.tabs[tabNumber].title,
			})
			.textContent();

		return {
			number: number?.trim() ?? "",
			title: title?.trim() ?? "",
		};
	}

	async previousStep() {
		await this.cancelButton.click();
	}

	async nextStep() {
		await this.nextButton.click();
	}

	async cancelAdCreating() {
		await this.cancelButton.click();
	}

	async reviewAd() {
		if (await this.reviewAdButton.isVisible()) await this.reviewAdButton.click();
	}
}
