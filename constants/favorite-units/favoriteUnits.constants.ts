import favoriteData from "./favoriteUnits.constants.json";

const FAVORITE_UNITS_CONSTS = {
    URL: favoriteData.url,
    EMPTY_TITLE: favoriteData["empty state"].title,
    GO_TO_ADS_BTN: favoriteData["empty state"].button,
    COLORS: {
        RED_FILL: favoriteData["heart attributes"]["active fill"],
        GREY_STROKE: favoriteData["heart attributes"]["inactive stroke"]
    },
    CLASSES: {
        NAVBAR_ACTIVE: new RegExp(`.*${favoriteData.classes.navbarActive}.*`)
    },
    TESTID: {
        UNIT_NAME: favoriteData.testId.unitName,
        FAVOURITE: favoriteData.testId.favourite
    }
} as const;

export { FAVORITE_UNITS_CONSTS };