import { createUnitConsts as data } from "@constants/create-unit/createUnit.constants";

export type TabNumber = keyof typeof data.tabs;

const tabMap = {
    mainInfo: "1",
    photos: "2",
    service: "3",
    price: "4",
    contacts: "5",
} as const;

type Tabs = {
    [K in keyof typeof tabMap]: (typeof data.tabs)[(typeof tabMap)[K]];
};
type Tab1 = Tabs["mainInfo"];
export type Tab1KeysWithLabel = {
    [K in keyof Tab1]: Tab1[K] extends { label: string } ? K : never;
}[keyof Tab1];

/**
 * This type uses for test data.
 * -
 * The real type has to have more fields.
 */
export type TestAdData = {
    title: string;
    manufacturer: string;
    photo: string;
    service: string;
    price: string;
};

/**
 * For API using
 * -
 */
export type CreateUnitPayload = {
    name: string;
    model_name: string;
    type_of_work: string;
    phone: string;
    minimal_price: number;
    money_value: string;
    payment_method: string;
    manufacturer: number;
    owner: number;
    lat: number;
    lng: number;
    services: number[];
    time_of_work: string;
    category: number;
};