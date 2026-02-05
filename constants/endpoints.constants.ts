import endpoints from "./endpoints.constants.json";

export const ENDPOINTS = {
    HOME: endpoints.home,
    CREATE_UNIT: endpoints["create unit"],
    PRODUCTS: endpoints.products,
    PRODUCTS_RE: /\/products\//,
    TENDERS: endpoints.tenders,
    REQUESTS: endpoints.requests,
    PRIVACY: endpoints.privacy,
    COOKIES: endpoints.cookies,
    TERMS: endpoints.terms,
    UNIT_DETAILS_RE: /\/unit\//
} as const;