import { FIELDS_ERRORS } from "../constants/create-unit/createUnit.constants";

/**
 * Formats the missing manufacturer error message by inserting the manufacturer name
 * between the quotes in the error template
 * @param errorTemplate - The template string with empty quotes (e.g., 'На жаль, виробника "" не знайдено...')
 * @param manufacturerName - The name of the missing manufacturer to insert
 * @returns Formatted error message with manufacturer name
 */
export function formatMissingManufacturerError(
    manufacturerName: string,
): string {
    return FIELDS_ERRORS.MISSING_MANUFACTURER.replace(
        "““",
        `“${manufacturerName}“`,
    );
}
