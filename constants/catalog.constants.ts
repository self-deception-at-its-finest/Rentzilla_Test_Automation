import catalog from "../constants/catalog.constants.json";
const catalogData = { ...catalog } as const;

const SPECIAL_EQUIPMENT = catalogData["special equipment"];
const SERVICES = catalogData.services;

export { SPECIAL_EQUIPMENT, SERVICES };
