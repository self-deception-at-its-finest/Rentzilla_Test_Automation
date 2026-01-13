import { expect, test} from '../../../fixtures/fixtures';
import {AuthenticationComponent} from "../../../components/authentication.component";


test.describe('Auth', () => {
    test('login', async ({ homePage, page }) => {
        const authComponent = new AuthenticationComponent(page);
        await homePage.open();

        await authComponent.login({email: process.env.USER_EMAIL, password: process.env.USER_PASSWORD});
    })
})