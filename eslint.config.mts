import json from "@eslint/json";
import globals from "globals";
import tseslint from "typescript-eslint";
import prettierPlugin from "eslint-plugin-prettier";
import prettierConfig from "eslint-config-prettier";
import { defineConfig } from "eslint/config";

export default defineConfig([
	{
		ignores: ["node_modules/**", "playwright/", "playwright-report/**", "test-results/**", "./*.json"],
	},

	{ files: ["**/*.ts"] },
	{
		files: ["constants/*.json"],
		plugins: { json },
		language: "json/json",
		extends: ["json/recommended"],
	},
	{ languageOptions: { globals: globals.browser } },
	tseslint.configs.recommended,
	prettierConfig,
	{
		plugins: {
			prettierPlugin,
		},
		rules: {
			"prettierPlugin/prettier": "warn",
			"no-multiple-empty-lines": ["warn", { max: 1 }],
			"no-unused-vars": "off",
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					varsIgnorePattern: "^_",
					argsIgnorePattern: "^_",
					caughtErrorsIgnorePattern: "^_",
					destructuredArrayIgnorePattern: "^_",
				},
			],
		},
	},
]);
