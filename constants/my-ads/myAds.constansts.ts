import myAdsData from "./myAds.constants.json";

const MY_ADS_CONSTS = {
    URL: myAdsData.url,
    EMPTY_TITLE: myAdsData["empty state"].title,
    EMPTY_DESCRIPTION: myAdsData["empty state"].description,
    CREATE_UNIT_BTN: myAdsData["empty state"].button,
} as const;

export { MY_ADS_CONSTS };