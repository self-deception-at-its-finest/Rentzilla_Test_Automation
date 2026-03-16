import { expect, test } from "../../fixtures/indexV2";
import { MY_ADS_CONSTS } from "../../constants/my-ads/myAds.constansts";
import { ENDPOINTS } from "../../constants/endpoints.constants";

test.describe("My Ads", () => {
  test("The 'Мої оголошення' page without any created units.",
    {
      tag: "@UI",
      annotation: { type: "Test case", description: "C321" },
    },
    async ({ authorizedHomePage, myAdsPage, page }) => {

      await test.step("--- Navigate to 'Мої оголошення'", async () => {
          await authorizedHomePage.navigateToMyAds();
          await expect(page).toHaveURL(MY_ADS_CONSTS.URL); 
      });

      await test.step("1. The message is displayed on the screen", async () => {
          await expect(myAdsPage.emptyTitle).toBeVisible();
          await expect(myAdsPage.emptyTitle).toHaveText(MY_ADS_CONSTS.EMPTY_TITLE);
      });

      await test.step("2. After click on the 'Подати оголошення' button the user is redirected to the 'Створення оголошення' page", async () => {
          await expect(myAdsPage.createUnitButton).toBeVisible();
          await expect(myAdsPage.createUnitButton).toHaveText(MY_ADS_CONSTS.CREATE_UNIT_BTN);
          await myAdsPage.createUnitButton.click();
          await expect(page).toHaveURL(ENDPOINTS.CREATE_UNIT);
      });
    });
});