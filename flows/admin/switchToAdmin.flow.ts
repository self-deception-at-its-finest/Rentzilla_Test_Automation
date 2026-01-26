import { Page } from "@playwright/test";
import { AuthenticationComponent } from "../../components/t-Authentication.component";
import endpoints from "../../constants/endpoints.constants.json";

type User = {
    email: string;
    password: string;
};
export async function switchToAdminFlow(page: Page, { email, password }: User) {
    const authComponent = new AuthenticationComponent(page);
    await authComponent.logout();
    await page.goto(endpoints.admin);
    await authComponent.loginAsAdmin({ email, password });
}
