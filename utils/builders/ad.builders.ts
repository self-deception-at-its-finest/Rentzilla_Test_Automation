import { env } from "@config/env";
import { SERVICES } from "@constants/catalog.constants";
import { MANUFACTURERS } from "@constants/create-unit/createUnit.constants";
import { CreateUnitPayload, TestAdData } from "@custom-types/tabs.types";
import { generateText } from "../fakeData";
import { getRandomElement } from "../getElements";
import { getRandomManufacturerId, getRandomPrice } from "../getRandomIndices";

/**
 * Building test ads via UI
 * @param count the number of ads created
 * @returns the array of ads created
 */
export function buildTestAds(count: number): TestAdData[] {
	return Array.from({ length: count }, () => ({
		title: "new_test_" + generateText(15),
		manufacturer: getRandomElement(MANUFACTURERS),
		photo: "1",
		service: SERVICES.subcategories["agricultural services"].subcategories["agrodrone services"].title,
		price: "1000",
	}));
}

export function apiBuildAds(count: number): CreateUnitPayload[] {
	return Array.from({ length: count }, () => ({
		name: "test_name_" + generateText(15),
		model_name: "model_" + generateText(5),
		manufacturer: getRandomManufacturerId(),
		description: "description_" + generateText(15),
		features: "features_" + generateText(15),
		category: 146,
		lat: 50.453,
		lng: 30.516,
		minimal_price: getRandomPrice(),
		money_value: "UAH",
		payment_method: "CASH_OR_CARD",
		phone: env.user.phone!, // linked to user
		type_of_work: "HOUR",
		time_of_work: "",
		owner: +env.user.id!, // linked to user
		services: [130],
	}));
}
