import { COLORS } from "@constants/colors.constants";
import { expect, Locator } from "@playwright/test";

async function expectColor(field: Locator, color: string, property: string = "border") {
	const escapedColor = color.replace(/[()]/g, "\\$&");
	await expect(field).toHaveCSS(property, new RegExp(`${escapedColor}$`));
}

export async function expectFieldError(field: Locator) {
	await expectColor(field, COLORS.ERROR);
}

export async function expectTextColorError(field: Locator) {
	await expectColor(field, COLORS.ERROR, "color");
}

export async function expectFieldDefault(field: Locator) {
	await expectColor(field, COLORS.DEFAULT);
}

async function expectTabAriaSelected(tab: Locator, value: "true" | "false") {
	await expect(tab).toHaveAttribute("aria-selected", value);
}

export async function expectTabActive(tab: Locator) {
	await expectTabAriaSelected(tab, "true");
}

export async function expectTabInactive(tab: Locator) {
	await expectTabAriaSelected(tab, "false");
}
