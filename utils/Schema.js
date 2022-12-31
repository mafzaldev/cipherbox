const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passwordSchema = new Schema({
  application: { type: String, required: true, unique: true },
  password: {
    IV: { type: String, required: true },
    encrypted: { type: String, required: true },
  },
});

module.exports = mongoose.model("Password", passwordSchema);
