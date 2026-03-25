import path from "path";

const authDir = path.resolve("playwright/.auth");
const adminFile = path.join(authDir, "admin.json");
const userFile = path.join(authDir, "user.json");
const newUserFile = path.join(authDir, "newUser.json");
const user2File = path.join(authDir, "user2.json");

export { authDir, adminFile, userFile, newUserFile, user2File };