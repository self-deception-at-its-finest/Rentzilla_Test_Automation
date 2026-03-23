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
    },
    user2: {
        email: getEnv("USER2_EMAIL"),
        password: getEnv("USER2_PASSWORD"),
        phone: getEnv("USER2_PHONE"),
        id: getEnv("USER2_ID"),
    },
};
