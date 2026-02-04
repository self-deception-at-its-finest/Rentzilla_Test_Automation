import { expect, Locator } from "@playwright/test";
import { CREATE_UNIT_CONSTS } from "../constants/create-unit/createUnit.constants";

export async function expectFieldError(field: Locator) {
    await expect(field).toHaveCSS(
        "border",
        `1px solid ${CREATE_UNIT_CONSTS.ERR_BORDER_COLOR}`,
    );
}

export async function expectFieldDefault(field: Locator) {
    await expect(field).toHaveCSS(
        "border",
        `1px solid ${CREATE_UNIT_CONSTS.BORDER_COLOR}`,
    );
}
