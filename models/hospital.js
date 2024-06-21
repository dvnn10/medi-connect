const mongoose = require("mongoose");

const conn = require("../config/dbconnection");

const hospitalSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  address: {
    type: String,
    required: true,
  },
  doctors: [
    {
      ref: "Doctor",
      type: mongoose.Schema.Types.ObjectId,
    },
  ],
});

let Hospital = conn.hospitalDB.model("Hospital", hospitalSchema);

module.exports = Hospital;
