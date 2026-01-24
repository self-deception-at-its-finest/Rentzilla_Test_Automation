import createUnitConstsJSON from "../constants/create-unit/create-unit.constants.json";

export const data = { ...createUnitConstsJSON } as const;

export type TabNumber = "1" | "2" | "3" | "4" | "5";

export type TabTitle =
    | "Основна інформація"
    | "Фотографії"
    | "Послуги"
    | "Вартість"
    | "Контакти";

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
