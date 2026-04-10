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
import { NewUserContactsComponent } from "@components/create-unit/5/NewUserContacts.component";
import { VerifiedUserContactsComponent } from "@components/create-unit/5/VerifiedUserContacts.component";

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

export type CreateUnitComponents = MainInfoComponents &
	PhotosComponents &
	ServiceComponents &
	PriceComponents &
	ContactsComponents;
