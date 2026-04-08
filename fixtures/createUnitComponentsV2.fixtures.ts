import { test as base } from "./apiAuth.fixtures";
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
import { NewUserContactsComponent } from "@components/create-unit/5/NewUserContacts.component";
import { makeFixture } from "./factories/makeFixture.factory";
import { BaseFixtures } from "@custom-types/fixtures/all.fixtures.types";

export const test = base.extend<BaseFixtures>({
	categoryComponent: makeFixture(CategoryComponent),
	adComponent: makeFixture(AdComponent),
	detailsComponent: makeFixture(DetailsComponent),
	locationComponent: makeFixture(LocationComponent),
	manufacturerComponent: makeFixture(ManufacturerComponent),
	modelComponent: makeFixture(ModelComponent),
	specificationsComponent: makeFixture(SpecificationsComponent),
	photosComponent: makeFixture(PhotosComponent),
	serviceComponent: makeFixture(ServiceComponent),
	priceComponent: makeFixture(PriceComponent),
	verifiedUserContactsComponent: makeFixture(VerifiedUserContactsComponent),
	newUserContactsComponent: makeFixture(NewUserContactsComponent, "newUserPage"),
});
