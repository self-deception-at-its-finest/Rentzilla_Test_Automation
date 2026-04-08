import type { Page } from "@playwright/test";

export type UserPageFixtures = {
	adminPage: Page;
	userPage: Page;
	newUserPage: Page;
	user2Page: Page;
};

export type UserPageKey = {
	[K in keyof UserPageFixtures]: UserPageFixtures[K] extends Page ? K : never;
}[keyof UserPageFixtures];

export type ExtendedPageKey = "page" | UserPageKey;
