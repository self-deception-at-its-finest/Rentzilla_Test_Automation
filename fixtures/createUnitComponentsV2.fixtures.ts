import { AdComponent } from "@components/create-unit/1/Ad.component";
import { CategoryComponent } from "@components/create-unit/1/Category.component";
import { DetailsComponent } from "@components/create-unit/1/Details.component";
import { LocationComponent } from "@components/create-unit/1/Location.component";
import { ManufacturerComponent } from "@components/create-unit/1/Manufacturer.component";
import { ModelComponent } from "@components/create-unit/1/Model.component";
import { SpecificationsComponent } from "@components/create-unit/1/Specifications.component";
import { PhotosComponent } from "@components/create-unit/2/Photos.component";
import { ServiceComponent } from "@components/create-unit/3/Service.component";
import { PriceComponent } from "@components/create-unit/4/Price.component";
import { VerifiedUserContactsComponent } from "@components/create-unit/5/VerifiedUserContacts.component";
import { test as base } from "./apiAuth.fixtures";
import { NewUserContactsComponent } from "@components/create-unit/5/NewUserContacts.component";

type MainInfoComponents = {
	adComponent: AdComponent;
	categoryComponent: CategoryComponent;
	detailsComponent: DetailsComponent;
	locationComponent: LocationComponent;
	manufacturerComponent: ManufacturerComponent;
	modelComponent: ModelComponent;
	specificationsComponent: SpecificationsComponent;
};

type PhotosComponents = {
	photosComponent: PhotosComponent;
};

type ServiceComponents = {
	serviceComponent: ServiceComponent;
};

type PriceComponents = {
	priceComponent: PriceComponent;
};

type ContactsComponents = {
	verifiedUserContactsComponent: VerifiedUserContactsComponent;
	newUserContactsComponent: NewUserContactsComponent;
};

export const test = base.extend<
	MainInfoComponents & PhotosComponents & ServiceComponents & PriceComponents & ContactsComponents
>({
	categoryComponent: [
		async ({ userPage }, use) => {
			await use(new CategoryComponent(userPage));
		},
		{ box: true },
	],
	adComponent: [
		async ({ userPage }, use) => {
			await use(new AdComponent(userPage));
		},
		{ box: true },
	],
	detailsComponent: [
		async ({ userPage }, use) => {
			await use(new DetailsComponent(userPage));
		},
		{ box: true },
	],
	locationComponent: [
		async ({ userPage }, use) => {
			await use(new LocationComponent(userPage));
		},
		{ box: true },
	],
	manufacturerComponent: [
		async ({ userPage }, use) => {
			await use(new ManufacturerComponent(userPage));
		},
		{ box: true },
	],
	modelComponent: [
		async ({ userPage }, use) => {
			await use(new ModelComponent(userPage));
		},
		{ box: true },
	],
	specificationsComponent: [
		async ({ userPage }, use) => {
			await use(new SpecificationsComponent(userPage));
		},
		{ box: true },
	],
	photosComponent: [
		async ({ userPage }, use) => {
			await use(new PhotosComponent(userPage));
		},
		{ box: true },
	],
	serviceComponent: [
		async ({ userPage }, use) => {
			await use(new ServiceComponent(userPage));
		},
		{ box: true },
	],
	priceComponent: [
		async ({ userPage }, use) => {
			await use(new PriceComponent(userPage));
		},
		{ box: true },
	],
	verifiedUserContactsComponent: [
		async ({ userPage }, use) => {
			await use(new VerifiedUserContactsComponent(userPage));
		},
		{ box: true },
	],
	newUserContactsComponent: [
		async ({ newUserPage }, use) => {
			await use(new NewUserContactsComponent(newUserPage));
		},
		{ box: true },
	],
});
