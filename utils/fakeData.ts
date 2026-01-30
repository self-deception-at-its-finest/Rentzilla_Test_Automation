import { faker } from "@faker-js/faker";

/**
 * Generates text with 10-100 characters
 */
export function generateValidText(): string {
    return faker.string.alphanumeric({
        length: { min: 10, max: 100 },
    });
}


/**
 * Generates text with custom length
 */
export function generateText(textLength: number): string {
    return faker.string.alphanumeric({ length: textLength });
}
