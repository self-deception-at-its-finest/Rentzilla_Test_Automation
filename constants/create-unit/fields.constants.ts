import { data } from "./create-unit.constants";

const t = "1" as const;

type Tab1 = (typeof data)["tabs"]["1"];

type KeysWithLabel = {
    [K in keyof Tab1]: Tab1[K] extends { label: string } ? K : never;
}[keyof Tab1];

const firstTabFields = {
    category: {
        label: data.tabs[t].category.label,
        placeholder: data.tabs[t].category.placeholder,
        popupTitle: data.tabs[t].category["popup title"],
        mobPopupTitle: data.tabs[t].category["mobile popup title"]
    },
    ad: {
        label: data.tabs[t].ad.label,
        placeholder: data.tabs[t].ad.placeholder,
        forbiddenSymbols: data.tabs[t].ad.forbiddenSymbols
    },
    manufacturer: {
        label: data.tabs[t].manufacturer.label,
        placeholder: data.tabs[t].manufacturer.placeholder
    } 
} as const;

const fieldErrors = {
    empty: data["error messages"]["empty"],
    tooFew: data["error messages"]["too few"],
    full: data["error messages"]["full"]
}

export { KeysWithLabel, firstTabFields, fieldErrors };
