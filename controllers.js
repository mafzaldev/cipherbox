const router = require("express").Router();
const { encryptPassword, decryptPassword } = require("./utils/Hashing");
const Password = require("./utils/Schema");

let IS_LOGGED_IN = false;

router.get("/", async (req, res, next) => {
  res.send("<h1>Hello World<h1/>");
});

router.get("/login", async (req, res, next) => {
  const { username, password } = req.body;

  if (
    username === `${process.env.ADMIN_NAME}` &&
    password === `${process.env.ADMIN_PASS}`
  ) {
    IS_LOGGED_IN = true;
    res.status(200).json({ response: "Logged in!" });
    return next();
  }

  res.status(401).json({ response: "Error 401! Unauthorized!" });
});

router.post("/storePassword", async (req, res, next) => {
  if (!IS_LOGGED_IN)
    return res.status(403).json({ response: "Error 403! Not logged in" });

  const { application, password } = req.body;
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
      response: "Error 403! Password already exists for this application",
    });
    return next();
  }

  res.status(200).json({ encryptedPassword });
});

router.get("/getPassword", async (req, res, next) => {
  if (!IS_LOGGED_IN)
    return res.status(403).json({ response: "Error 403! Not logged in" });

  const { application } = req.body;
  let decryptedPassword, response;

  try {
    response = await Password.findOne({ application });
    if (!response) throw new Exception(NaN);
  } catch {
    res
      .status(404)
      .json({ response: "Error 404! Could not find the requested password" });
    return next();
  }

  let encryptedPassword = response.password.encrypted;
  let initialVector = response.password.IV;
  decryptedPassword = decryptPassword(encryptedPassword, initialVector);

  res.status(200).json({ decryptedPassword });
});

module.exports = router;
