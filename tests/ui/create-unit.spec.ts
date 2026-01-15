import { expect, test } from "../../fixtures/fixtures";
import createUnitConstants from "../../constants/create-unit.constants.json";

test.describe("«Створення оголошення» UI testing", () => {
    test(
        "C294. Verify body title and tab titles",
        { tag: "@UI" },
        async ({ createUnitPage }) => {
            await test.step("The page title is: ⤵️", async () => {
                await test.step("• visible", async () => {
                    await expect(createUnitPage.pageTitle).toBeVisible();
                });
                await test.step("• correct", async () => {
                    await expect(createUnitPage.pageTitle).toHaveText(
                        createUnitConstants["page title"]
                    );
                });
            });

            await test.step(`The first tab: ⤵️`, async () => {
                const { number: tabNumber, title: tabTitle } =
                    await createUnitPage.getTabMetaInfo("1");

                await test.step(`• is selected;`, async () => {
                    expect(createUnitPage.tabList.first()).toHaveAttribute(
                        "aria-selected",
                        "true"
                    );
                });
                await test.step(`• has the “${tabTitle}” title;`, async () => {
                    expect(tabTitle).toEqual(tabTitle);
                });
                await test.step(`• has the “${tabNumber}” number.`, async () => {
                    expect(tabNumber).toEqual("1");
                });
            });
        }
    );
});
