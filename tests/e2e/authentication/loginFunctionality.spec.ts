import { expect, test} from '../../../fixtures/fixtures';
import {AuthenticationComponent} from "../../../components/authentication.component";
import {HeaderComponent} from "../../../components/header.component";
import {faker} from "@faker-js/faker";
import errorMessages from '../../../constants/errorMessages.constants.json';


test.describe('Login functionality', () => {
    test('C201: Authorization with valid email and password', async ({homePage, page}) => {
        const authComponent = new AuthenticationComponent(page);

        await test.step('Open home page', async () => {
            await homePage.open();
        });

        await test.step('Login with valid email and password', async () => {
            await authComponent.verifySuccessfulLogin(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
        });
    });
    test('C202: Authorization with valid phone and password', async ({homePage, page}) => {
        const authComponent = new AuthenticationComponent(page);
        const headerComponent = new HeaderComponent(page);

        await test.step('Open home page', async () => {
            await homePage.open();
        });

        const phoneNumbers = [
            process.env.USER_PHONE!,
            process.env.USER_PHONE!.slice(1),
            process.env.USER_PHONE!.slice(3),
        ];

        for (const phone of phoneNumbers) {
            await test.step(`Login with phone number: ${phone}`, async () => {
                await authComponent.verifySuccessfulLogin(phone, process.env.USER_PASSWORD!);
            });

            await test.step('Logout user', async () => {
                await headerComponent.profileDropdownLogoutButton.click();
            });
        }
    });

    test('C203: Authorization with invalid credentials', async ({homePage, page}) => {
        const authComponent = new AuthenticationComponent(page);
        const headerComponent = new HeaderComponent(page);

        await test.step('Open home page', async () => {
            await homePage.open();
        });

        await test.step('Open authorization modal', async () => {
            await headerComponent.authenticationButton.click();
        });

        await test.step('Fill valid password', async () => {
            await authComponent.passwordInput.fill(process.env.USER_PASSWORD!);
        });

        const invalidEmails = [
            'testuserrentzilagmail.com',
            'testuserrentzila@gmailcom',
            'testuserrentzila@gmail',
        ];

        for (const email of invalidEmails) {
            await test.step(`Try login with invalid email format: ${email}`, async () => {
                await authComponent.emailInput.fill(email);
                await authComponent.submitRandomly();
                await expect(authComponent.invalidEmailFormatMsg).toBeVisible();
            });
        }

        await test.step('Try login with non-existing email', async () => {
            await authComponent.emailInput.fill(faker.internet.email());
            await authComponent.submitRandomly();
            await expect(authComponent.invalidEmailOrPasswordMsg).toBeVisible();
            await expect(authComponent.invalidEmailOrPasswordMsg)
                .toHaveText(errorMessages.invalidEmailOrPassword);
        });

        await test.step('Fill valid email', async () => {
            await authComponent.emailInput.fill(process.env.USER_EMAIL!);
        });

        const invalidPasswords = [
            process.env.USER_PASSWORD! + ' ',
            ' ' + process.env.USER_PASSWORD! + ' ',
            process.env.USER_PASSWORD!.toLowerCase(),
        ];

        for (const password of invalidPasswords) {
            await test.step(`Try login with invalid password: "${password}"`, async () => {
                await authComponent.passwordInput.fill(password);
                await authComponent.submitRandomly();
                await expect(authComponent.invalidPasswordFormatMsg).toBeVisible();
            });
        }
    });
    test('C207: Authorization with invalid phone number', async ({homePage, page}) => {
        const authComponent = new AuthenticationComponent(page);
        const headerComponent = new HeaderComponent(page);

        await test.step('Open home page', async () => {
            await homePage.open();
        });

        await test.step('Open authorization modal', async () => {
            await headerComponent.authenticationButton.click();
        });

        await test.step('Fill valid password', async () => {
            await authComponent.passwordInput.fill(process.env.USER_PASSWORD!);
        });

        const invalidPhoneNumbers = [
            '971241111',
            '097124111',
            '+380-97-124-1111',
        ];

        for (const number of invalidPhoneNumbers) {
            await test.step(`Try login with invalid phone number: ${number}`, async () => {
                await authComponent.emailInput.fill(number);
                await authComponent.submitRandomly();
                await expect(authComponent.invalidEmailFormatMsg).toBeVisible();
            });
        }
    });

    test('C200: Authorization with empty fields', async ({homePage, page}) => {
        const authComponent = new AuthenticationComponent(page);
        const headerComponent = new HeaderComponent(page);

        await test.step('Open home page', async () => {
            await homePage.open();
        });

        await test.step('Open authorization modal', async () => {
            await headerComponent.authenticationButton.click();
        });

        await test.step('Submit form with empty email and password', async () => {
            await authComponent.submitRandomly();

            await expect(authComponent.emailInput)
                .toHaveCSS('border-color', 'rgb(247, 56, 89)');
            await expect(authComponent.passwordInput)
                .toHaveCSS('border-color', 'rgb(247, 56, 89)');

            await expect(authComponent.emptyEmailFieldMsg).toBeVisible();
            await expect(authComponent.emptyPasswordFieldMsg).toBeVisible();
        });

        await test.step('Submit form with filled email and empty password', async () => {
            await authComponent.emailInput.fill(process.env.USER_EMAIL!);
            await authComponent.submitRandomly();

            await expect(authComponent.emailInput)
                .toHaveCSS('border-color', 'rgb(229, 229, 229)');
            await expect(authComponent.passwordInput)
                .toHaveCSS('border-color', 'rgb(247, 56, 89)');

            await expect(authComponent.emptyPasswordFieldMsg).toBeVisible();
        });

        await test.step('Submit form with empty email and filled password', async () => {
            await authComponent.emailInput.clear();
            await authComponent.passwordInput.fill(process.env.USER_PASSWORD!);
            await authComponent.submitRandomly();

            await expect(authComponent.emailInput)
                .toHaveCSS('border-color', 'rgb(247, 56, 89)');
            await expect(authComponent.passwordInput)
                .toHaveCSS('border-color', 'rgb(229, 229, 229)');

            await expect(authComponent.emptyEmailFieldMsg).toBeVisible();
        });
    });
});