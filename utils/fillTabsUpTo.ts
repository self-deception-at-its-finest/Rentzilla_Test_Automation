import { Page } from "@playwright/test";
import { buildTestAds } from "./builders/ad.builders";
import { fillTab1Flow, fillTab2Flow, fillTab3Flow, fillTab4Flow } from "@flows/ads/fillTabs.flow";
import { CreateUnitPage } from "@pages/CreateUnit.page";
import { generateText } from "./fakeData";

type FillLevel = 1 | 2 | 3 | 4;

export function fillTabsUpTo(
	page: Page,
	level: FillLevel,
	setService: boolean,
): Promise<{ createUnitPage: CreateUnitPage; service: string }>;

export function fillTabsUpTo(page: Page, level: FillLevel, setService?: false): Promise<CreateUnitPage>;

export async function fillTabsUpTo(page: Page, level: FillLevel, setService: boolean = false) {
	const createUnitPage = new CreateUnitPage(page);
	const ad = buildTestAds(1)[0];

	await fillTab1Flow(page, ad);
	await createUnitPage.nextStep();
	if (level < 2) return createUnitPage;

	await fillTab2Flow(page, ad.photo);
	await createUnitPage.nextStep();
	if (level < 3) return createUnitPage;

	const service = ad.service + (setService ? generateText(10) : "");
	await fillTab3Flow(page, service);
	if (setService) return { createUnitPage, service };

	await createUnitPage.nextStep();
	if (level < 4) return createUnitPage;

	await fillTab4Flow(page, ad.price);
	await createUnitPage.nextStep();
	return createUnitPage;
}
