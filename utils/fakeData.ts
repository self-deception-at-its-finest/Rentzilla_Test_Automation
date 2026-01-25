import { faker } from "@faker-js/faker";

/**
 * Generates text with less than 10 characters
 */
export function generateShortText(): string {
    let text = faker.lorem.word();
    while (text.length > 9) {
        text = faker.lorem.word();
    }
    return text;
}

/**
 * Generates text with 10-100 characters
 */
export function generateMediumText(): string {
    let text = faker.lorem.sentence();
    while (text.length < 10 || text.length > 100) {
        text = faker.lorem.sentence();
    }
    return text;
}

/**
 * Generates text with custom length
 */
export function generateText(textLength: number): string {
    return faker.string.alphanumeric({ length: textLength });
}