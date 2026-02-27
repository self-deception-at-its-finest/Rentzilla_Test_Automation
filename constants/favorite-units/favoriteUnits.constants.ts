import favoriteData from "./favoriteUnits.constants.json";

const FAVORITE_UNITS_CONSTS = {
    URL: favoriteData.url,
    EMPTY_TITLE: favoriteData["empty state"].title,
    EMPTY_DESCRIPTION: favoriteData["empty state"].description,
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
    },
    SORT_OPTIONS: {
        DATE: favoriteData.sortOptions.date,
        NAME: favoriteData.sortOptions.name
    },
    CATEGORIES: {
        ALL: favoriteData.categories.all,
        NOT_FOUND: (category: string): string => `Оголошення в категорії "${category}" не знайдені`,
        NOT_ONE_OF: (actualCategoryText: string, expectedSubs: string[]): string => `Категорія "${actualCategoryText}" не є жодною з очікуваних підкатегорій: ${expectedSubs.join(', ')}`
    },
    NAMES: {
        UNITS: favoriteData.names.units,
        FAVORITE: favoriteData.names.favorite,
        FAVORITES: favoriteData.names.favorites,
        FAVORITE_UNITS: favoriteData.names.favoriteUnits,
        CLEAR: favoriteData.names.clear,
        YES: favoriteData.names.yes,
        NO: favoriteData.names.no,
        RESET_FILTERS: favoriteData.names.resetFilters,
        SEARCH_BY_NAME: favoriteData.names.searchByName,
        GO_TO_ADS: favoriteData.names.goToAds
    }
} as const;

export { FAVORITE_UNITS_CONSTS };