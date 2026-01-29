import { expect, test} from '../../../fixtures/fixtures';
import {faker} from "@faker-js/faker";
import errorMessages from '../../../constants/errorMessages.constants.json';
import colors from '../../../constants/colors.constants.json';

test.describe('Login functionality', () => {
    test.beforeEach(async ({ homePage }) => {
        await test.step('Open home page', async () => {
            await homePage.open();
        });
    });
    test('C201: Authorization with valid email and password', async ({ authComponent, headerComponent }) => {
        await test.step('Open Login form', async () => {
            await authComponent.openLoginForm();
        });

        await test.step('Fill valid credentials', async () => {
            await authComponent.fillCredentials(process.env.USER_EMAIL!, process.env.USER_PASSWORD!);
        });

        await test.step('Toggle password visibility', async () => {
            await authComponent.togglePasswordVisibility();
            await expect(authComponent.passwordInput).toHaveAttribute('type', 'text')

            await authComponent.togglePasswordVisibility();
            await expect(authComponent.passwordInput).toHaveAttribute('type', 'password')
        });

        await test.step('Press login or "Enter"', async () => {
            await authComponent.submitRandomly();
        });

        await test.step('Verify user is logged in', async () => {
            await headerComponent.openProfileDropdown();
            await expect(headerComponent.profileDropdownEmail).toBeVisible()
            await expect(headerComponent.profileDropdownEmail).toHaveText(process.env.USER_EMAIL!);
        });
    });
    test('C202: Authorization with valid phone and password', async ({ authComponent, headerComponent }) => {
        const phoneNumbers = [
            process.env.USER_PHONE!,
            process.env.USER_PHONE!.slice(1),
            process.env.USER_PHONE!.slice(3),
        ];

        for (const phone of phoneNumbers) {
            await test.step(`Login with phone number: ${phone}`, async () => {
                await authComponent.openLoginForm();
                await authComponent.fillCredentials(phone, process.env.USER_PASSWORD!);
                await authComponent.submitRandomly();
            });

            await test.step('Verify user is logged in', async () => {
                await headerComponent.openProfileDropdown();
                await expect(headerComponent.profileDropdownEmail).toBeVisible()
                await expect(headerComponent.profileDropdownEmail).toHaveText(process.env.USER_EMAIL!);
            });

            await test.step('Logout user', async () => {
                await headerComponent.profileDropdownLogoutButton.click();
            });
        }
    });

    test('C203: Authorization with invalid credentials', async ({ authComponent }) => {
        await test.step('Open Login form', async () => {
            await authComponent.openLoginForm();
        });

        const invalidEmails = [
            'testuserrentzilagmail.com',
            'testuserrentzila@gmailcom',
            'testuserrentzila@gmail',
            'testuser rentzila@gmail.com',
            'testuserrentzila@.com',
            'testuserrentzila@@gmail.com',
            'testuserrentzila',
            'еуіегіуккутеяшдф'
        ];

        for (const email of invalidEmails) {
            await test.step(`Try login with invalid email format: ${email}`, async () => {
                await authComponent.fillCredentials(email, process.env.USER_PASSWORD!);
                await authComponent.submitRandomly();
                await expect(authComponent.invalidEmailFormatMsg).toBeVisible();
            });
        }

        await test.step('Try login with non-existing email', async () => {
            await authComponent.fillCredentials(faker.internet.email(), process.env.USER_PASSWORD!);
            await authComponent.submitRandomly();
            await expect(authComponent.invalidEmailOrPasswordMsg).toBeVisible();
            await expect(authComponent.invalidEmailOrPasswordMsg).toHaveText(errorMessages.invalidEmailOrPassword);
        });

        const invalidPasswords = [
            process.env.USER_PASSWORD! + ' ',
            ' ' + process.env.USER_PASSWORD! + ' ',
            process.env.USER_PASSWORD!.toLowerCase(),
        ];

        for (const password of invalidPasswords) {
            await test.step(`Try login with invalid password: "${password}"`, async () => {
                await authComponent.fillCredentials(process.env.USER_EMAIL!, password);
                await authComponent.submitRandomly();
                await expect(authComponent.invalidPasswordFormatMsg).toBeVisible();
            });
        }
    });
    test('C207: Authorization with invalid phone number', async ({ authComponent }) => {
        await test.step('Open Login form', async () => {
            await authComponent.openLoginForm();
        });

        const invalidPhoneNumbers = [
            '971241111',
            '097124111',
            '+380-97-124-1111',
        ];

        for (const number of invalidPhoneNumbers) {
            await test.step(`Try login with invalid phone number: ${number}`, async () => {
                await authComponent.fillCredentials(number, process.env.USER_PASSWORD!);
                await authComponent.submitRandomly();
                await expect(authComponent.invalidEmailFormatMsg).toBeVisible();
            });
        }
    });

    test('C200: Authorization with empty fields', async ({ authComponent }) => {
        await test.step('Open Login form', async () => {
            await authComponent.openLoginForm();
        });

        await test.step('Submit form with empty email and password', async () => {
            await authComponent.submitRandomly();

            await expect(authComponent.emailInput).toHaveCSS('border-color', colors.errorBorderColor);
            await expect(authComponent.passwordInput).toHaveCSS('border-color', colors.errorBorderColor);

            await expect(authComponent.emptyEmailFieldMsg).toBeVisible();
            await expect(authComponent.emptyPasswordFieldMsg).toBeVisible();
        });

        await test.step('Submit form with filled email and empty password', async () => {
            await authComponent.emailInput.fill(process.env.USER_EMAIL!);
            await authComponent.submitRandomly();

            await expect(authComponent.emailInput).toHaveCSS('border-color', colors.defaultBorderColor);
            await expect(authComponent.passwordInput).toHaveCSS('border-color', colors.errorBorderColor);

            await expect(authComponent.emptyPasswordFieldMsg).toBeVisible();
        });

        await test.step('Submit form with empty email and filled password', async () => {
            await authComponent.emailInput.clear();
            await authComponent.passwordInput.fill(process.env.USER_PASSWORD!);
            await authComponent.submitRandomly();

            await expect(authComponent.emailInput).toHaveCSS('border-color', colors.errorBorderColor);
            await expect(authComponent.passwordInput).toHaveCSS('border-color', colors.defaultBorderColor);

            await expect(authComponent.emptyEmailFieldMsg).toBeVisible();
        });
    });
});