import homeData from "./homePage.constants.json";

export const MAIN_PAGE_CONSTS = {
    SERVICES: {
        SECTION_TITLE: homeData.services.sectionTitle,
        EXPECTED_COUNT: 7,
    },
    SPECIAL_EQUIPMENT: {
        SECTION_TITLE: homeData.specialEquipment.sectionTitle,
        EXPECTED_COUNT: 7,
    }
} as const;