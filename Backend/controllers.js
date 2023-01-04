const router = require("express").Router();
const { encryptPassword, decryptPassword } = require("./utils/Hashing");
const Password = require("./utils/Schema");

router.post("/storePassword", async (req, res, next) => {
  const { username, userpass, application, password } = req.body;

  if (
    username !== `${process.env.ADMIN_NAME}` ||
    userpass !== `${process.env.ADMIN_PASS}`
  ) {
    res.status(403).json({ log: "Error 403! Forbidden" });
    return next();
  }

  const { base64IV, encryptedPassword } = encryptPassword(password);

  const createdPassword = new Password({
    application,
    password: {
      IV: base64IV,
      encrypted: encryptedPassword,
    },
  });

  try {
    await createdPassword.save();
  } catch {
    res.status(404).json({
      log: "Error 403! Password already exists for this application",
    });
    return next();
  }

  res.status(200).json({ log: "Password stored in Database successfully!" });
});

router.post("/getPassword", async (req, res, next) => {
  const { username, userpass, application } = req.body;

  if (
    username !== `${process.env.ADMIN_NAME}` ||
    userpass !== `${process.env.ADMIN_PASS}`
  ) {
    res.status(403).json({ log: "Error 403! Forbidden" });
    return next();
  }

  let decryptedPassword, response;

  try {
    response = await Password.findOne({ application });
    if (!response) throw new Exception(NaN);
  } catch {
    res
      .status(404)
      .json({ log: "Error 404! Could not find the requested password" });
    return next();
  }

  let encryptedPassword = response.password.encrypted;
  let initialVector = response.password.IV;
  decryptedPassword = decryptPassword(encryptedPassword, initialVector);

  res
    .status(200)
    .json({ log: "Password retrieved successfully!", data: decryptedPassword });
});

module.exports = router;
