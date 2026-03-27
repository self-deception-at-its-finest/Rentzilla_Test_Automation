import { BaseComponent } from "@components/create-unit/5/Base.component";
import { Locator } from "@playwright/test";

export type FieldData = {
	label: Locator;
	input: Locator;
	error: Locator;
	labelText: string;
};

export async function validateFieldByBothMethods<T extends BaseComponent>(
	component: T,
	field: FieldData,
	value: string,
	assertion: () => Promise<void>,
) {
	await validateTypeIntoField(component, field, value, assertion);
	await validateFillInField(component, field, value, assertion);
}

export async function validateTypeIntoField<T extends BaseComponent>(
	component: T,
	field: FieldData,
	value: string,
	assertion: () => Promise<void>,
) {
	await component.fieldActions.typeIntoField(field.input, value);
	await assertion();
	await component.fieldActions.clearField(field.input);
	await field.input.evaluate((el) => el.blur());
}

export async function validateFillInField<T extends BaseComponent>(
	component: T,
	field: FieldData,
	value: string,
	assertion: () => Promise<void>,
) {
	await component.fieldActions.fillInField(field.input, value);
	await assertion();
	await component.fieldActions.clearField(field.input);
}
