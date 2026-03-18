import myAdsData from "./myAds.constants.json";

const MY_ADS_CONSTS = {
    URL: myAdsData.url,
    EMPTY_STATE: {
        TITLE: myAdsData["empty state"].title,
        DESCRIPTION: myAdsData["empty state"].description,
        CREATE_UNIT_BTN: myAdsData["empty state"].button,
    },
    TABS: {
        ACTIVE: myAdsData["tabs"]["active"],
        DEACTIVATED: myAdsData["tabs"]["deactivated"],
        PENDING: myAdsData["tabs"]["pending"],
        REJECTED: myAdsData["tabs"]["rejected"],
    },
    EMPTY_TITLES: {
        ACTIVE: myAdsData["empty_titles"]["active"],
        DEACTIVATED: myAdsData["empty_titles"]["deactivated"],
        PENDING: myAdsData["empty_titles"]["pending"],
        REJECTED: myAdsData["empty_titles"]["rejected"],
    },
    CATEGORIES: {
        BUILDING_EQUIPMENT: myAdsData["categories"]["building equipment"],
        COMMUNAL_EQUIPMENT: myAdsData["categories"]["communal equipment"],
        WAREHOUSE_EQUIPMENT: myAdsData["categories"]["warehouse equipment"]
    },
    SORTING: {
        BY_NAME: myAdsData["sorting"]["by_name"],
        BY_DATE: myAdsData["sorting"]["by_date"]
    }

} as const;

export { MY_ADS_CONSTS };