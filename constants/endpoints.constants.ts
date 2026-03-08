import endpoints from "./endpoints.constants.json";

export const ENDPOINTS = {
    API: {
        CREATE_OR_LOGIN: endpoints.api["create or login"],
        SERVICES: endpoints.api.services,
        CRM_SERVICES: endpoints.api["crm services"],
        UNITS: endpoints.api.units
    },
    HOME: endpoints.home,
    CREATE_UNIT: endpoints["create unit"],
    PRODUCTS: endpoints.products,
    PRODUCTS_RE: /\/products\//,
    TENDERS: endpoints.tenders,
    REQUESTS: endpoints.requests,
    PRIVACY: endpoints.privacy,
    COOKIES: endpoints.cookies,
    TERMS: endpoints.terms,
    UNIT_DETAILS_RE: /\/unit\//,
} as const;
