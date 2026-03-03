import { FIELDS_ERRORS } from "../constants/create-unit/createUnit.constants";

function formatErrorMessage(message: string, missingObject: string): string {
    return message.replace("““", `“${missingObject}“`);
}

/**
 * Formats the missing manufacturer error message by inserting the manufacturer name
 * between the quotes in the error template
 * @param manufacturerName - The name of the missing manufacturer to insert
 * @returns Formatted error message with manufacturer name
 */
export function formatMissingManufacturerError(
    manufacturerName: string,
): string {
    return formatErrorMessage(
        FIELDS_ERRORS.MISSING_MANUFACTURER,
        manufacturerName,
    );
}

/**
 * Formats the missing service error message by inserting the service
 * between the quotes in the error template
 * @param service - The name of the missing service to insert
 * @returns Formatted error message with the service
 */
export function formatMissingServiceError(service: string): string {
    return formatErrorMessage(FIELDS_ERRORS.MISSING_SERVICE, service);
}
