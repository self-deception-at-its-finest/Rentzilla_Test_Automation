import createUnitConstsJSON from "./create-unit.constants.json";

const data = { ...createUnitConstsJSON } as const;

const tabNumbers = Object.keys(data.tabs) as (keyof typeof data.tabs)[];

type Tab = (typeof tabNumbers)[number];

const createUnitConsts = {
    BORDER_COLOR: "rgb(229, 229, 229)",
    ERR_BORDER_COLOR: "rgb(247, 56, 89)",
    PAGE_TITLE: data["page title"],
} as const;

export { type Tab, data, tabNumbers, createUnitConsts };
