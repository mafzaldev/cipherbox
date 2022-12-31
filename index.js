const express = require("express");
const mongoose = require("mongoose");
const router = require("./controllers");

require("dotenv").config();

const app = express();

app.use(express.json());
app.use("/", router);

mongoose.set("strictQuery", true);
mongoose
  .connect(`${process.env.MONGODB_URI}`)
  .then(() => app.listen(5000))
  .catch((err) => console.log(err));
