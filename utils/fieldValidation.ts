import { BaseComponent } from "@components/create-unit/5/Base.component";
import { Locator } from "@playwright/test";

export type FieldData = {
	label: Locator;
	input: Locator;
	error: Locator;
	labelText: string;
};

function isFieldData(field: FieldData | Locator): field is FieldData {
	return "input" in field;
}

function resolveInput(field: FieldData | Locator): Locator {
	return isFieldData(field) ? field.input : field;
}

export async function validateFieldByBothMethods<T extends BaseComponent>(
	component: T,
	field: FieldData | Locator,
	value: string,
	assertion: () => Promise<void>,
	clearFirst: boolean = false,
) {
	await validateTypeIntoField(component, field, value, assertion, clearFirst);
	await validateFillInField(component, field, value, assertion, clearFirst);
}

export async function validateTypeIntoField<T extends BaseComponent>(
	component: T,
	field: FieldData | Locator,
	value: string,
	assertion: () => Promise<void>,
	clearFirst: boolean = false,
) {
	const input = resolveInput(field);
	await component.fieldActions.typeIntoField(input, value, clearFirst);
	await assertion();
	await component.fieldActions.clearField(input);
	await input.evaluate((el) => el.blur());
}

export async function validateFillInField<T extends BaseComponent>(
	component: T,
	field: FieldData | Locator,
	value: string,
	assertion: () => Promise<void>,
	clearFirst: boolean = false,
) {
	const input = resolveInput(field);
	await component.fieldActions.fillInField(input, value, clearFirst);
	await assertion();
	await component.fieldActions.clearField(input);
}
