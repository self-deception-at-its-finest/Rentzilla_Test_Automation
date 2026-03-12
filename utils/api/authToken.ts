import fs from "fs";

type StorageState = {
    origins: {
        localStorage: {
            name: string;
            value: string;
        }[];
    }[];
};

export function getAccessToken(filePath: string): string {
    const storage: StorageState = JSON.parse(
        fs.readFileSync(filePath, "utf-8"),
    );

    const access = storage.origins[0].localStorage.find(
        (item) => item.name === "access",
    );

    if (!access) {
        throw new Error("Access token not found in storageState");
    }

    return access.value;
}
