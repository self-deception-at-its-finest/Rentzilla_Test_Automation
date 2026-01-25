import { Locator } from "@playwright/test";

export async function getFieldPlaceholder(
    locator: Locator,
): Promise<string | null> {
    return await locator.getAttribute("placeholder");
}
