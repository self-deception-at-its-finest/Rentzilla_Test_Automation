import { SERVICES } from "../../constants/catalog.constants";
import { MANUFACTURERS } from "../../constants/create-unit/create-unit.constants";
import { TestAdData } from "../../types/tabs";
import { generateText } from "../fake-data";
import { getRandomStringElement } from "../get-elements";

/**
 * 
 * @param count the number of ads created
 * @returns the array of ads created
 */
export function buildTestAds(count: number): TestAdData[] {
    return Array.from({ length: count }, () => ({
        title: "new_test_" + generateText(15),
        manufacturer: getRandomStringElement(MANUFACTURERS),
        photo: "test-photo.png",
        service:
            SERVICES["agricultural services"].subcategories[
                "agrodrone services"
            ].title,
        price: "1000",
    }));
}
