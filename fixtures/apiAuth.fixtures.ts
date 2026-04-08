import { UserPageFixtures } from "@custom-types/fixtures/userPage.fixtures.types";
import { test as base } from "./base.fixtures";
import { expect } from "@playwright/test";
import { adminFile, newUserFile, user2File, userFile } from "@utils/api/authPaths";
import { makeRolePage } from "./factories/makeRolePageFixture.factory";

export const test = base.extend<UserPageFixtures>({
	adminPage: makeRolePage(adminFile),
	userPage: makeRolePage(userFile),
	newUserPage: makeRolePage(newUserFile),
	user2Page: makeRolePage(user2File),
});

export { expect };
