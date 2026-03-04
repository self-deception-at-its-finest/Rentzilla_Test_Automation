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

type MainInfoTab = {
    title: string;
    category: CategorySection;
    ad: FieldSection;
    manufacturer: FieldSection;
    model: FieldSection;
    location: LocationSection;
    specifications: Pick<FieldSection, "label">;
    details: Pick<FieldSection, "label">;
};

type PhotosTab = {
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

type ServiceTab = {
    title: string;
    description: string;
    addInfo: string;
    placeholder: string;
    addedServicesTitle: string;
    addServiceButtonText: string;
};

type PriceTab = {
    title: string;
    paymentLabel: string;
    payment: {
        cash: string;
        cashlessNoVAT: string;
        cashlessVAT: string;
    };
    priceLabel: string;
    fieldPlaceholder: string;
    servicePriceLabel: string;
    servicePriceDesc: string;
    addServicePrice: string;
    servicePriceTypes: {
        h: string;
        sh: string;
        t: string;
        ga: string;
        m2: string;
        m3: string;
        km: string;
    };
    shifts: {
        eight: string;
        four: string;
    };
};

type Tabs = {
    mainInfo: MainInfoTab;
    photos: PhotosTab;
    service: ServiceTab;
    price: PriceTab;
};

const tab1 = data.tabs["1"];
const tab2 = data.tabs["2"];
const tab3 = data.tabs["3"];
const tab4 = data.tabs["4"];

const tabs: Tabs = {
    mainInfo: {
        title: tab1.title,
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
        addServiceButtonText: tab3["add service button text"],
    },
    price: {
        title: tab4.title,
        paymentLabel: tab4["payment method label"],
        payment: {
            cash: tab4["payment methods"].cash,
            cashlessNoVAT: tab4["payment methods"]["cashless without VAT"],
            cashlessVAT: tab4["payment methods"]["cashless with VAT"],
        },
        priceLabel: tab4["price field label"],
        fieldPlaceholder: tab4["price field placeholder"],
        servicePriceLabel: tab4["service price label"],
        servicePriceDesc: tab4["service price description"],
        addServicePrice: tab4["add service price"],
        servicePriceTypes: {
            h: tab4["service price types"].h,
            sh: tab4["service price types"].sh,
            t: tab4["service price types"].t,
            ga: tab4["service price types"].ga,
            m2: tab4["service price types"].m2,
            m3: tab4["service price types"].m3,
            km: tab4["service price types"].km,
        },
        shifts: {
            eight: tab4["shifts"].eight,
            four: tab4["shifts"].four,
        },
    },
} as const;

const DEFAULT_LOCATION = "Київ, Україна, Київська область";

const MAX_IMAGES = 12;

// * The value of the “d” attribute for <path>
const SELECTED_ICON = "M1 5.54545L5.54545 10.0909L13.1212 1";

// * The value of the “d” attribute for <path>
const SELECT_ICON = "M7 7H1M7 13V7V13ZM7 7V1V7ZM7 7H13H7Z";

const DROPDOWN_ICON =
    "M0.156939 0.832926L5.73587 6.00053L0.156939 11.1681C0.0570611 11.2605 0.00114502 11.3844 0.00114502 11.5135C0.00114502 11.6425 0.0570611 11.7665 0.156939 11.8588C0.205451 11.9035 0.263353 11.939 0.327257 11.9633C0.391161 11.9875 0.45978 12 0.529097 12C0.598413 12 0.667032 11.9875 0.730936 11.9633C0.794839 11.939 0.852743 11.9035 0.901254 11.8588L6.83745 6.36137C6.94167 6.26483 7 6.13535 7 6.00053C7 5.86571 6.94167 5.73623 6.83745 5.63969L0.902399 0.142258C0.853852 0.0972366 0.795806 0.0614538 0.731691 0.0370207C0.667575 0.0125866 0.598689 0 0.529097 0C0.459505 0 0.390617 0.0125866 0.326502 0.0370207C0.262386 0.0614538 0.204342 0.0972366 0.155794 0.142258C0.0559155 0.234586 0 0.358529 0 0.487592C0 0.616655 0.0559155 0.740598 0.155794 0.832926H0.156939Z";

export {
    KeysWithLabel,
    tabs,
    DEFAULT_LOCATION,
    MAX_IMAGES,
    SELECTED_ICON,
    SELECT_ICON,
    DROPDOWN_ICON,
};
