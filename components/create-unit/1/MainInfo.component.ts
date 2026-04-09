import { Locator, Page } from "@playwright/test";
import { FieldActions } from "@components/FieldActions";
import { AdComponent } from "./sections/Ad.component";
import { CategoryComponent } from "./sections/Category.component";
import { DetailsComponent } from "./sections/Details.component";
import { LocationComponent } from "./sections/Location.component";
import { ManufacturerComponent } from "./sections/Manufacturer.component";
import { ModelComponent } from "./sections/Model.component";
import { SpecificationsComponent } from "./sections/Specifications.component";

export class MainInfoComponent {
	readonly adSection: AdComponent;
	readonly categorySection: CategoryComponent;
	readonly detailsSection: DetailsComponent;
	readonly locationSection: LocationComponent;
	readonly manufacturerSection: ManufacturerComponent;
	readonly modelSection: ModelComponent;
	readonly specificationsSection: SpecificationsComponent;

	private readonly fieldActions: FieldActions;

	constructor(protected readonly page: Page) {
		this.adSection = new AdComponent(this.page);
		this.categorySection = new CategoryComponent(this.page);
		this.detailsSection = new DetailsComponent(this.page);
		this.locationSection = new LocationComponent(this.page);
		this.manufacturerSection = new ManufacturerComponent(this.page);
		this.modelSection = new ModelComponent(this.page);
		this.specificationsSection = new SpecificationsComponent(this.page);

		this.fieldActions = new FieldActions(this.page);
	}

	// Need to type, not paste
	protected async typeIntoField(field: Locator, str: string) {
		await this.fieldActions.typeIntoField(field, str);
	}

	protected async fillInField(field: Locator, str: string) {
		await this.fieldActions.fillInField(field, str);
	}

	protected async clearField(field: Locator) {
		await this.fieldActions.clearField(field);
	}
}
