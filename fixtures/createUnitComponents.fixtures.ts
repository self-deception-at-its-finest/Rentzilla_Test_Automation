import { AdComponent } from "../components/create-unit/1/Ad.component";
import { CategoryComponent } from "../components/create-unit/1/Category.component";
import { DetailsComponent } from "../components/create-unit/1/Details.component";
import { LocationComponent } from "../components/create-unit/1/Location.component";
import { ManufacturerComponent } from "../components/create-unit/1/Manufacturer.component";
import { ModelComponent } from "../components/create-unit/1/Model.component";
import { SpecificationsComponent } from "../components/create-unit/1/Specifications.component";
import { PhotosComponent } from "../components/create-unit/2/Photos.component";
import { PriceComponent } from "../components/create-unit/4/Price.component";
import { ContactsComponent } from "../components/create-unit/5/Contacts.component";
import { test as base } from "./base.fixtures";

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
    serviceComponent: ServiceComponents;
};

type PriceComponents = {
    priceComponent: PriceComponent;
};

type ContactsComponents = {
    contactsComponent: ContactsComponent;
};

export const test = base.extend<
    MainInfoComponents &
        PhotosComponents &
        ServiceComponents &
        PriceComponents &
        ContactsComponents
>({
    categoryComponent: [
        async ({ page }, use) => {
            await use(new CategoryComponent(page));
        },
        { box: true },
    ],
    adComponent: [
        async ({ page }, use) => {
            await use(new AdComponent(page));
        },
        { box: true },
    ],
    detailsComponent: [
        async ({ page }, use) => {
            await use(new DetailsComponent(page));
        },
        { box: true },
    ],
    locationComponent: [
        async ({ page }, use) => {
            await use(new LocationComponent(page));
        },
        { box: true },
    ],
    manufacturerComponent: [
        async ({ page }, use) => {
            await use(new ManufacturerComponent(page));
        },
        { box: true },
    ],
    modelComponent: [
        async ({ page }, use) => {
            await use(new ModelComponent(page));
        },
        { box: true },
    ],
    specificationsComponent: [
        async ({ page }, use) => {
            await use(new SpecificationsComponent(page));
        },
        { box: true },
    ],
    photosComponent: [
        async ({ page }, use) => {
            await use(new PhotosComponent(page));
        },
        { box: true },
    ],
});
