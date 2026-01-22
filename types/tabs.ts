import createUnitConstsJSON from "../constants/create-unit/create-unit.constants.json";

export const data = { ...createUnitConstsJSON } as const;

export type TabNumber = "1" | "2" | "3" | "4" | "5";

export type TabTitle =
    | "Основна інформація"
    | "Фотографії"
    | "Послуги"
    | "Вартість"
    | "Контакти";
