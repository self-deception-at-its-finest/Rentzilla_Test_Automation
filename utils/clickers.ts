import { Locator } from "@playwright/test";

export async function clickElement(element: Locator) {
    await element.click();
}
