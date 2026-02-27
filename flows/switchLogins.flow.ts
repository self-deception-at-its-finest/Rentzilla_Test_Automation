import { Page } from "@playwright/test";
import { AuthenticationComponent } from "../components/Authentication.component";
import endpoints from "../constants/endpoints.constants.json";
import { AdminPage } from "../pages/Admin.page";

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

export async function switchToUserFlow(page: Page, { email, password }: User) {
    page.goto(endpoints.admin);
    const adminPage = new AdminPage(page);
    await adminPage.logout();
    await new AuthenticationComponent(page).login({ email, password });
}
