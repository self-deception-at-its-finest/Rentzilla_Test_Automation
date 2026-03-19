import createUnitConstsJSON from "./create-unit.constants.json";
import { manufacturers } from "../manufacturers.constants.json";

const data = { ...createUnitConstsJSON } as const;

const FORBIDDEN_SYMBOLS = data.forbiddenSymbols;

const TAB_NUMBERS = Object.keys(data.tabs) as (keyof typeof data.tabs)[];

const TAB_TITLES = Object.values(data.tabs).map((tab) => tab.title);

const FIELDS_ERRORS = {
    EMPTY: data.errorMessages.empty,
    LESS_10_SYMBOLS: data.errorMessages.less10symbols,
    MORE_100_SYMBOLS: data.errorMessages.more100symbols,
    MISSING_MANUFACTURER: data.errorMessages.missingManufacturer,
    MORE_15_SYMBOLS: data.errorMessages.more15symbols,
    MISSING_LOCATION: data.errorMessages.missingLocation,
    MISSING_SERVICE: data.errorMessages.missingService,
    INVALID_PHONE_NUMBER: data.errorMessages.invalidPhoneNumber,
} as const;

// Common constants for the “Create unit” page
const CREATE_UNIT_CONSTS = {
    BORDER_COLOR: "rgb(229, 229, 229)",
    ERR_BORDER_COLOR: "rgb(247, 56, 89)",
    ERR_TEXT_COLOR: "rgb(247, 56, 89)",
    PAGE_TITLE: data.pageTitle,
} as const;

const MANUFACTURERS = manufacturers;

const BUTTONS = {
    CANCEL: data.buttons.cancel,
    BACK: data.buttons.back,
    NEXT: data.buttons.next,
} as const;

export {
    data,
    FORBIDDEN_SYMBOLS,
    TAB_NUMBERS,
    BUTTONS,
    TAB_TITLES,
    FIELDS_ERRORS,
    CREATE_UNIT_CONSTS,
    MANUFACTURERS,
};
