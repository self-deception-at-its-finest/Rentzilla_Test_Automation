import { Locator } from "@playwright/test";

export async function fieldPlaceholder(
    locator: Locator,
): Promise<string | null> {
    return await locator.getAttribute("placeholder");
}
