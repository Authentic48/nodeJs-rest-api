const mongoose = require("mongoose");
const userSchema = mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    toJSON: {
      transform(doc, ret) {
        delete ret.password;
        },
    },
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
