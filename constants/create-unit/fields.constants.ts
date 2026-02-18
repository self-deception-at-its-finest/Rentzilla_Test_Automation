import { data } from "./createUnit.constants";

type Tab1 = (typeof data)["tabs"]["1"];
type KeysWithLabel = {
    [K in keyof Tab1]: Tab1[K] extends { label: string } ? K : never;
}[keyof Tab1];

type FieldSection = {
    label: string;
    placeholder: string;
};

type CategorySection = FieldSection & {
    popupTitle: string;
    mobPopupTitle: string;
};

type LocationSection = FieldSection & {
    buttonText: string;
    modal: {
        title: string;
        cancel: string;
        accept: string;
    };
};

type PhotosSection = {
    title: string;
    photosForm: {
        label: string;
        description: string;
    };
    errorModals: {
        sameImage: string;
        invalidPhoto: string;
        button: string;
    };
};

type ServiceSection = {
    title: string;
    description: string;
    addInfo: string;
    placeholder: string;
    addedServicesTitle: string;
    addServiceButtonText: string;
};

type TabFields = {
    category: CategorySection;
    ad: FieldSection;
    manufacturer: FieldSection;
    model: FieldSection;
    location: LocationSection;
    specifications: Pick<FieldSection, "label">;
    details: Pick<FieldSection, "label">;
    photos: PhotosSection;
    service: ServiceSection;
};

const tab1 = data.tabs["1"];
const tab2 = data.tabs["2"];
const tab3 = data.tabs["3"];

const tabsFields: TabFields = {
    category: {
        label: tab1.category.label,
        placeholder: tab1.category.placeholder,
        popupTitle: tab1.category["popup title"],
        mobPopupTitle: tab1.category["mobile popup title"],
    },
    ad: {
        label: tab1.ad.label,
        placeholder: tab1.ad.placeholder,
    },
    manufacturer: {
        label: tab1.manufacturer.label,
        placeholder: tab1.manufacturer.placeholder,
    },
    model: {
        label: tab1.model.label,
        placeholder: tab1.model.placeholder,
    },
    location: {
        label: tab1.location.label,
        placeholder: tab1.location.placeholder,
        buttonText: tab1.location["button text"],
        modal: {
            title: tab1.location.modal.title,
            cancel: tab1.location.modal.cancel,
            accept: tab1.location.modal.accept,
        },
    },
    specifications: {
        label: tab1.specifications.label,
    },
    details: {
        label: tab1.details.label,
    },
    photos: {
        title: tab2.title,
        photosForm: {
            label: tab2["photos form"].label,
            description: tab2["photos form"].description,
        },
        errorModals: {
            sameImage: tab2["error modals"]["same image"],
            invalidPhoto: tab2["error modals"]["invalid photo"],
            button: tab2["error modals"]["button"],
        },
    },
    service: {
        title: tab3.title,
        description: tab3.description,
        addInfo: tab3["add info"],
        placeholder: tab3.placeholder,
        addedServicesTitle: tab3["added services title"],
        addServiceButtonText: tab3["add service button text"]
    },
} as const;

const DEFAULT_LOCATION = "Київ, Україна, Київська область";

const MAX_IMAGES = 12;

// * The value of the “d” attribute for <path>
const SELECTED_ICON = "M1 5.54545L5.54545 10.0909L13.1212 1";

// * The value of the “d” attribute for <path>
const SELECT_ICON = "M7 7H1M7 13V7V13ZM7 7V1V7ZM7 7H13H7Z";

export {
    KeysWithLabel,
    tabsFields,
    DEFAULT_LOCATION,
    MAX_IMAGES,
    SELECTED_ICON,
    SELECT_ICON,
};
