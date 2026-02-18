import { expect, Locator } from "@playwright/test";
import { CREATE_UNIT_CONSTS } from "../constants/create-unit/createUnit.constants";
import {
    SELECT_ICON,
    SELECTED_ICON,
} from "../constants/create-unit/fields.constants";

export async function expectFieldError(field: Locator) {
    await expect(field).toHaveCSS(
        "border",
        `1px solid ${CREATE_UNIT_CONSTS.ERR_BORDER_COLOR}`,
    );
}

export async function expectTextColorError(field: Locator) {
    await expect(field).toHaveCSS(
        "color",
        `${CREATE_UNIT_CONSTS.ERR_TEXT_COLOR}`,
    );
}

export async function expectFieldDefault(field: Locator) {
    await expect(field).toHaveCSS(
        "border",
        `1px solid ${CREATE_UNIT_CONSTS.BORDER_COLOR}`,
    );
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

function expectServiceHaveAttribute(service: Locator, value: string) {
    expect(service.locator("svg > path")).toHaveAttribute("d", value);
}

export function expectServiceSelected(service: Locator) {
    expectServiceHaveAttribute(service, SELECTED_ICON);
}

export function expectServiceNonSelected(service: Locator) {
    expectServiceHaveAttribute(service, SELECT_ICON);
}
