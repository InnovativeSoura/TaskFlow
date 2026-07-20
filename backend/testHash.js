import bcrypt from "bcryptjs";

const password = "Soura@2003";

const hash =
  "$2b$10$jdOV.5GB0jPUP7MAREPrm.JCFuiKYYmrtZ0zU0FR9RuKmtK3mgObi";

const match = await bcrypt.compare(password, hash);

console.log(match);