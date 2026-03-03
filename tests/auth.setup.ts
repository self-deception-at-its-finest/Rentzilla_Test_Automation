import { test as setup } from "@playwright/test";
import { env } from "../config/env";
import { ENDPOINTS } from "../constants/endpoints.constants";

import path from "path";
import fs from "fs";

const adminFile = path.resolve("playwright/.auth/admin.json");
const userFile = path.resolve("playwright/.auth/user.json");
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
].forEach(({ role, email, password, fileName }) => {
    setup(`authenticate role: ${role}`, async ({ request }) => {
        if (fs.existsSync(fileName)) {
            console.log(`“${role}” auth file already exists`);
            return;
        }
        const response = await request.post(ENDPOINTS.API.CREATE_OR_LOGIN, {
            data: {
                email: email,
                password: password,
                phone: "phone",
            },
        });

        if (!response.ok()) {
            throw new Error(
                `Auth failed: ${response.status()} ${await response.text()}`,
            );
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
