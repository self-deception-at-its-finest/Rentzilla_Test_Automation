import { Page } from "@playwright/test";

export function isDesktop(page: Page): boolean {
    const viewport = page.viewportSize();
    return !!viewport && viewport.width >= 1280;
}

