import { generateText } from "./fakeData";

export function generateNonExistentName(existingNames: string[]): string {
    let randomName: string;
    do {
        randomName = "NON_EXISTENT_" + generateText(10);
    } while (existingNames.some(name => name.includes(randomName)));
    
    return randomName;
}