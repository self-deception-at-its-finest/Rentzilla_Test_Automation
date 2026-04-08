import { test as base } from "./base.fixtures";
import { AuthenticationComponent } from "@components/Authentication.component";
import { HeaderComponent } from "@components/Header.component";
import { makeFixture } from "./factories/makeFixture.factory";
import { BaseFixtures } from "@custom-types/fixtures/all.fixtures.types";

export const test = base.extend<BaseFixtures>({
	authComponent: makeFixture(AuthenticationComponent, "page"),
	headerComponent: makeFixture(HeaderComponent, "page"),
});
