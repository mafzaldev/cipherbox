const crypto = require("crypto");

const encryptPassword = (password) => {
  const INIT_VECTOR = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    `${process.env.ALGORITHM}`,
    `${process.env.SECURITY_KEY}`,
    INIT_VECTOR
  );

  let encryptedPassword = cipher.update(password, "utf-8", "hex");
  let base64IV = Buffer.from(INIT_VECTOR, "binary").toString("base64");
  encryptedPassword += cipher.final("hex");
  return { base64IV, encryptedPassword };
};

const decryptPassword = (password, IV) => {
  const INIT_VECTOR = Buffer.from(IV, "base64");

  const decipher = crypto.createDecipheriv(
    `${process.env.ALGORITHM}`,
    `${process.env.SECURITY_KEY}`,
    INIT_VECTOR
  );

  let decryptedPassword = decipher.update(password, "hex", "utf-8");
  decryptedPassword += decipher.final("utf8");
  return decryptedPassword;
};

module.exports = {
  encryptPassword,
  decryptPassword,
};
