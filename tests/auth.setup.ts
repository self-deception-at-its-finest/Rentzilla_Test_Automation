import { test as setup } from "@playwright/test";
import { env } from "@config/env";
import { ENDPOINTS } from "@constants/endpoints.constants";
import fs from "fs";
import { authDir, adminFile, userFile, newUserFile, user2File } from "@utils/api/authPaths";

fs.mkdirSync(authDir, { recursive: true });

[
	{
		role: "admin",
		email: env.admin.email,
		password: env.admin.password,
		fileName: adminFile,
	},
	{
		role: "user",
		email: env.user.email,
		password: env.user.password,
		fileName: userFile,
	},
	{
		role: "newUser",
		email: env.newUser.email,
		password: env.newUser.password,
		fileName: newUserFile,
	},
	{
        role: "user2",
        email: env.user2.email,
        password: env.user2.password,
        fileName: user2File,
    }
].forEach(({ role, email, password, fileName }) => {
	setup.describe("Creating user browser contexts", () => {
		setup(`authenticate role: ${role}`, async ({ request }) => {
			if (fs.existsSync(fileName)) {
				console.log(`“${role}” auth file already exists`);
				return;
			}
			const response = await request.post(ENDPOINTS.API.CREATE_OR_LOGIN, {
				data: {
					email: email,
					password: password,
				},
			});

			if (!response.ok()) {
				throw new Error(`Auth failed: ${response.status()} ${await response.text()}`);
			}

			const { access, refresh } = await response.json();

			const storageState = {
				cookies: [],
				origins: [
					{
						origin: process.env.BASE_URL!,
						localStorage: [
							{ name: "access", value: access },
							{ name: "refresh", value: refresh },
						],
					},
				],
			};

			fs.writeFileSync(fileName, JSON.stringify(storageState, null, 2));
		});
	});
});
