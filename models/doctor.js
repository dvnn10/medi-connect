const mongoose = require("mongoose");

const conn = require("../config/dbconnection");

const doctorSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  speciality: {
    type: String,
    required: true,
  },
  phone: {
    type: String,
    required: true,
  },
  hospital: {
    ref: "Hospital",
    type: mongoose.Schema.Types.String,
  },
});

const Doctor = conn.hospitalDB.model("Doctor", doctorSchema);

module.exports = Doctor;
