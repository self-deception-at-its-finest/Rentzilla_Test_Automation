import { data } from "../../types/tabs";
import { manufacturers } from "../manufacturers.constants.json";

const FORBIDDEN_SYMBOLS = data["forbidden symbols"];

const TAB_NUMBERS = Object.keys(data.tabs) as (keyof typeof data.tabs)[];

const TAB_TITLES = Object.values(data.tabs).map((tab) => tab.title);

const FIELDS_ERRORS = {
    EMPTY: data["error messages"]["empty"],
    LESS_10_SYMBOLS: data["error messages"]["less 10 symbols"],
    MORE_100_SYMBOLS: data["error messages"]["more 100 symbols"],
    MISSING_MANUFACTURER: data["error messages"]["missing manufacturer"],
    MORE_15_SYMBOLS: data["error messages"]["more 15 symbols"],
};

const CREATE_UNIT_CONSTS = {
    BORDER_COLOR: "rgb(229, 229, 229)",
    ERR_BORDER_COLOR: "rgb(247, 56, 89)",
    PAGE_TITLE: data["page title"],
} as const;

const MANUFACTURERS = manufacturers;

export {
    FORBIDDEN_SYMBOLS,
    TAB_NUMBERS,
    TAB_TITLES,
    FIELDS_ERRORS,
    CREATE_UNIT_CONSTS,
    MANUFACTURERS,
};
