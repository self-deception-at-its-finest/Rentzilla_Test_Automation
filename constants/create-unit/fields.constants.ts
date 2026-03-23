import { data } from "./createUnit.constants";

type Tab1 = (typeof data)["tabs"]["1"];
type KeysWithLabel = {
    [K in keyof Tab1]: Tab1[K] extends { label: string } ? K : never;
}[keyof Tab1];

type Tabs = {
    mainInfo: (typeof data.tabs)["1"];
    photos: (typeof data.tabs)["2"];
    service: (typeof data.tabs)["3"];
    price: (typeof data.tabs)["4"];
    contacts: (typeof data.tabs)["5"];
};

const tabs = {
    mainInfo: data.tabs["1"],
    photos: data.tabs["2"],
    service: data.tabs["3"],
    price: data.tabs["4"],
    contacts: data.tabs["5"],
} satisfies Tabs;

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
