import type { Page } from "@playwright/test";
import { ExtendedPageKey, UserPageKey } from "@custom-types/fixtures/userPage.fixtures.types";
import { AllFixtures } from "@custom-types/fixtures/all.fixtures.types";
import { EndpointKey } from "@custom-types/fixtures/page.fixtures.types";
import endpointsJson from "@constants/endpoints.constants.json";

type FixtureTuple<T> = [
	(args: AllFixtures, use: (value: T) => Promise<void>) => Promise<void>,
	{ box: boolean; title?: string },
];
/**
 * Creates a Playwright fixture that instantiates a page object or component
 * using one of the available browser pages (`page`, `userPage`, `newUserPage`,
 * `user2Page`, `adminPage`). The function supports multiple call signatures and
 * automatically resolves which arguments represent the page key, endpoint, and
 * options.
 *
 * Usage patterns:
 *
 * ### 1. Only the page object class:
 * ```ts
 * // Uses `"userPage"` as the default page key and no endpoint, with `{ box: true }`.
 * makeFixture(HomePage);
 * ```
 *
 * ### 2. Class + endpoint:
 * ```ts
 * // Treats the second argument as an endpoint and uses `"userPage"` as the default page key.
 * // Options (e.g. `{ box: false }`) can be passed as the third argument.
 * makeFixture(HomePage, "home");
 * makeFixture(HomePage, "home", { box: false });
 * ```
 *
 * ### 3. Class + page key:
 * ```ts
 * // Uses the provided page key and no endpoint.
 * // Options can be passed as the third argument.
 * makeFixture(HomePage, "page");
 * makeFixture(HomePage, "page", { box: false });
 * ```
 *
 * ### 4. Class + page key + endpoint:
 * ```ts
 * // Uses the specified page key and navigates to the given endpoint.
 * // Options can be passed as the fourth argument.
 * makeFixture(HomePage, "userPage", "home");
 * makeFixture(HomePage, "userPage", "home", { box: false });
 * ```
 *
 * **Behavior**:
 * - If no page key is provided, `"userPage"` is used by default.
 * - If the first argument after the class is recognized as an endpoint key,
 *   it is treated as an endpoint; otherwise, it is treated as a page key.
 * - When both a page key and an endpoint are provided, the selected page
 *   automatically navigates to that endpoint before the page object is constructed.
 * - The returned fixture injects an instance of the provided page object class
 *   into the test context via `use(new PageClass(selectedPage))`.
 * - `options.box` controls the `box` flag for the underlying fixture metadata
 *   and defaults to `true` when not provided.
 *
 * @param PageClass           The page object or component class to instantiate.
 * @param pageKeyOrEndpoint   Optional page key or endpoint, depending on overload.
 * @param endpointOrOptions   Optional endpoint or options object, depending on overload.
 * @param options             Optional fixture options (e.g., `{ box: boolean }`).
 * @returns A fixture tuple (`FixtureTuple<T>`) that Playwright uses as a TestFixture.
 */

export function makeFixture<T>(
	PageClass: new (page: Page) => T,
	pageKey?: ExtendedPageKey,
	endpoint?: EndpointKey,
	options?: { box: boolean },
): FixtureTuple<T>;

export function makeFixture<T>(
	PageClass: new (page: Page) => T,
	endpoint: EndpointKey,
	options?: { box: boolean },
): FixtureTuple<T>;

export function makeFixture<T>(
	PageClass: new (page: Page) => T,
	pageKey: ExtendedPageKey,
	endpoint: EndpointKey,
	options?: { box: boolean },
): FixtureTuple<T>;

export function makeFixture<T>(
	PageClass: new (page: Page) => T,
	pageKey: ExtendedPageKey,
	options?: { box: boolean },
): FixtureTuple<T>;

export function makeFixture<T>(
	PageClass: new (page: Page) => T,
	pageKeyOrEndpoint?: ExtendedPageKey | EndpointKey,
	endpointOrOptions?: EndpointKey | { box: boolean },
	options?: { box: boolean },
): FixtureTuple<T> {
	let pageKey: ExtendedPageKey = "userPage";
	let endpoint: EndpointKey | undefined;
	let opts: { box: boolean } = { box: true };

	// 1) makeFixture(PageClass)
	if (pageKeyOrEndpoint === undefined) {
		// pageKey = "userPage"
		// endpoint = undefined
		// opts = { box: true }
	}

	// 2) makeFixture(PageClass, endpoint)
	else if (isEndpoint(pageKeyOrEndpoint)) {
		endpoint = pageKeyOrEndpoint;
		if (endpointOrOptions && typeof endpointOrOptions !== "string") opts = endpointOrOptions;
	}

	// 3) makeFixture(PageClass, pageKey)
	else if (!isEndpoint(pageKeyOrEndpoint)) {
		pageKey = pageKeyOrEndpoint;

		// 3a) makeFixture(PageClass, pageKey, endpoint)
		if (typeof endpointOrOptions === "string") {
			endpoint = endpointOrOptions;
			opts = options ?? { box: true };
		}

		// 3b) makeFixture(PageClass, pageKey, options)
		else if (endpointOrOptions && typeof endpointOrOptions !== "string") opts = endpointOrOptions;
	}

	return [
		async (
			{ page, userPage, newUserPage, user2Page, adminPage }: AllFixtures,
			use: (value: T) => Promise<void>,
		) => {
			const pages: Record<UserPageKey, Page> = { userPage, newUserPage, user2Page, adminPage };
			const p = pageKey === "page" ? page : pages[pageKey];
			if (endpoint) await p.goto(endpointsJson[endpoint] as string);
			await use(new PageClass(p));
		},
		opts,
	];
}

function isEndpoint(value: string): value is EndpointKey {
	return value in endpointsJson;
}
