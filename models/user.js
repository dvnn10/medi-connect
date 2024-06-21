const mongoose = require("mongoose");

const Loginschema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: false,
  },
  gender: {
    type: String,
    required: false,
  },
  phone: {
    type: Number,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: false,
  },
  allergy: {
    type: String,
    required: false,
  },
});

const User = new mongoose.model("users", Loginschema);

module.exports = User;
