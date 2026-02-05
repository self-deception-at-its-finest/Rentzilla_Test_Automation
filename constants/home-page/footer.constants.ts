import footerData from "./footer.constants.json";

export const FOOTER_CONSTS = {
    LABELS: {
        ABOUT_US: footerData.labels.aboutUs,
        FOR_USERS: footerData.labels.forUsers,
        CONTACTS: footerData.labels.contacts,
    },
    LINKS: {
        PRIVACY: footerData.links.privacy,
        COOKIES: footerData.links.cookies,
        TERMS: footerData.links.terms,
        ADS: footerData.links.ads,
        TENDERS: footerData.links.tenders,
        REQUESTS: footerData.links.requests,
        EMAIL: footerData.links.email,
    },
    URLS: {
        PRIVACY: footerData.urls.privacy,
        COOKIES: footerData.urls.cookies,
        TERMS: footerData.urls.terms,
        ADS: footerData.urls.ads,
        TENDERS: footerData.urls.tenders,
        REQUESTS: footerData.urls.requests,
    },
    EXPECTED_TITLES: {
        PRIVACY_PAGE: footerData.expectedTitles.privacyPage,
        COOKIES_PAGE: footerData.expectedTitles.cookiesPage,
        TERMS_PAGE: footerData.expectedTitles.termsPage,
        MAIN_PAGE_HERO: footerData.expectedTitles.mainPageHero,
    },
    PLACEHOLDERS: {
        ADS_SEARCH: footerData.placeholders.adsSearch,
        TENDERS_SEARCH: footerData.placeholders.tendersSearch,
        REQUESTS_SEARCH: footerData.placeholders.requestsSearch,
    }
} as const;