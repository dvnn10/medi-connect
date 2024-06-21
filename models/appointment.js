const mongoose = require("mongoose");

// Define the schema for the appointment model
const appointmentSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  hospital: {
    type: String,
    required: true,
  },
  doctor: {
    type: String,
    required: true,
  },
  slot: {
    type: String,
    required: true,
  },
});

// Create the appointment model
const Appointment = mongoose.model("Appointment", appointmentSchema);

// Export the appointment model
module.exports = Appointment;
