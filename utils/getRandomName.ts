import { generateText } from "./fakeData";

export function generateNonExistentName(existingNames: string[]): string {
    const existing = new Set(existingNames);
    let randomName: string;

    do {
        randomName = "NON_EXISTENT_" + generateText(10);
    } while (existing.has(randomName));

    return randomName;
}