import { expect, test} from '../../../fixtures/fixtures';


test.describe('Check services', () => {
    test('Checking ""Послуги"" section on the main page', async ({ homePage}) => {
        await homePage.open();

        await expect(homePage.servicesTitle).toBeVisible();
        await expect(homePage.servicesTitle).toHaveText("Послуги");
    })
})