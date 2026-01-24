import { data } from "../../types/tabs";

const first = "1";
const second = "2";
const third = "3";
const fourth = "4";
const fifth = "5";

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
    location: FieldSection;
};

const firstTabFields: FirstTabFields = {
    category: {
        label: data.tabs[first].category.label,
        placeholder: data.tabs[first].category.placeholder,
        popupTitle: data.tabs[first].category["popup title"],
        mobPopupTitle: data.tabs[first].category["mobile popup title"],
    },
    ad: {
        label: data.tabs[first].ad.label,
        placeholder: data.tabs[first].ad.placeholder,
    },
    manufacturer: {
        label: data.tabs[first].manufacturer.label,
        placeholder: data.tabs[first].manufacturer.placeholder,
    },
    model: {
        label: data.tabs[first].model.label,
        placeholder: data.tabs[first].model.placeholder
    },
    location: {
        label: data.tabs[first].location.label,
        placeholder: data.tabs[first].location.label
    }

} as const;

export { KeysWithLabel, firstTabFields };
