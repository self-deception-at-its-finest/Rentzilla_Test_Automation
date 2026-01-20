import createUnitConstsJSON from "./create-unit.constants.json";

export const data = { ...createUnitConstsJSON } as const;

export const createUnitConsts = {
    errorBorderColor: "rgb(247, 56, 89)",
    defaultBorderColor: "rgb(229, 229, 229)",
    pageTitle: data["page title"],
} as const;
