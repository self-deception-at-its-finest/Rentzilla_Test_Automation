import { test } from "@playwright/test";
import { getAccessToken } from "@utils/api/authToken";
import { adminFile, userFile } from "@utils/api/authPaths";
import { ApiHelper } from "@utils/api/ApiHelper";
import { apiBuildAds } from "@utils/builders/ad.builders";

test.describe("API test | Create and delete ADs", () => {
	const adminToken = getAccessToken(adminFile);
	const userToken = getAccessToken(userFile);

	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	const createdAds: any[] = [];

	test.beforeAll(async ({ request }) => {
		const ads = apiBuildAds(2);
		for (const ad of ads) {
			createdAds.push(await new ApiHelper(request).createUnit(userToken, ad));
		}
	});

	test.afterAll(async ({ request }) => {
		for (const ad of createdAds) {
			await new ApiHelper(request).deleteUnitById(adminToken, ad.id);
		}
	});

	test("First ad", async ({}) => {
		console.log("Created Unit:", createdAds[0]);
	});

	test("Second ad", async ({}) => {
		console.log("Created Unit:", createdAds[1]);
	});
});
