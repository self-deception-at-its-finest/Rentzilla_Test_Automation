import { data } from "../../types/tabs";

const t = "1" as const;

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

type FirstTabFields = {
    category: CategorySection;
    ad: FieldSection;
    manufacturer: FieldSection;
    model: FieldSection;
};

const firstTabFields: FirstTabFields = {
    category: {
        label: data.tabs[t].category.label,
        placeholder: data.tabs[t].category.placeholder,
        popupTitle: data.tabs[t].category["popup title"],
        mobPopupTitle: data.tabs[t].category["mobile popup title"],
    },
    ad: {
        label: data.tabs[t].ad.label,
        placeholder: data.tabs[t].ad.placeholder,
    },
    manufacturer: {
        label: data.tabs[t].manufacturer.label,
        placeholder: data.tabs[t].manufacturer.placeholder,
    },
    model: {
        label: data.tabs[t].model.label,
        placeholder: data.tabs[t].model.placeholder
    }

} as const;

export { KeysWithLabel, firstTabFields };
