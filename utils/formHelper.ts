import { Locator } from "@playwright/test";

export async function getFieldPlaceholder(
    locator: Locator,
): Promise<string | null> {
    return await locator.getAttribute("placeholder");
}

export function capitalize(str: string): string {
    if (!str) return str;
    const [first, ...rest] = [...str];
    return first.toUpperCase() + rest.join("");
}
