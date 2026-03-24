function getEnv(name: string): string {
	const value = process.env[name];
	if (!value) {
		throw new Error(`Environment variable ${name} is not defined`);
	}
	return value;
}

export const env = {
	admin: {
		email: getEnv("ADMIN_EMAIL"),
		password: getEnv("ADMIN_PASSWORD"),
	},
	user: {
		email: getEnv("USER_EMAIL"),
		password: getEnv("USER_PASSWORD"),
		phone: getEnv("USER_PHONE"),
		id: getEnv("USER_ID"),
		firstName: getEnv("USER_FIRST_NAME"),
		lastName: getEnv("USER_LAST_NAME"),
	},
	newUser: {
		email: getEnv("NEW_USER_EMAIL"),
		password: getEnv("NEW_USER_PASSWORD"),
	},
};
