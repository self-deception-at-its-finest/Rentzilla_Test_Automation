import path from "path";

const authDir = path.resolve("playwright/.auth");
const adminFile = path.join(authDir, "admin.json");
const userFile = path.join(authDir, "user.json");
const newUserFile = path.join(authDir, "newUser.json");

export { authDir, adminFile, userFile, newUserFile };
