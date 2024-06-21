const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const axios = require("axios");

const adminRouter = express.Router();
adminRouter.use(bodyParser.json());
const User = require("../models/user");
const Appointment = require("../models/appointment");
const Doctor = require("../models/doctor");
const Hospital = require("../models/hospital");

//Admin-login

adminRouter.post("/admin-login", async (req, res) => {
  try {
    const email = "admin@123";
    const password = "Admin@123";

    if (!(email == req.body.email && password == req.body.password)) {
      res.render("admin-login", {
        errorMessage: "Invalid login credentials",
        successMessage: null,
      });
      return;
    }

    // Successful login

    console.log("Login successful");
    const results = await axios.get("http://localhost:5000/admin/metrics");
    console.log(results.data.appointmentsByHospital);
    res.render("admin-dash", {
      totalPatients: results.data.totalPatients,
      totalDoctors: results.data.totalDoctors,
      totalAppointments: results.data.totalAppointments,
    });
  } catch (error) {
    console.error("Login error:", error);
    res.render("admin-login", {
      errorMessage: "An error occurred. Please try again later.",
      successMessage: null,
    });
  }
});

adminRouter.get("/metrics", async (req, res) => {
  const patients = await User.find();
  const totalPatients = patients.length;
  const appointments = await Appointment.find();
  const totalAppointments = appointments.length;

  const doctors = await Doctor.find();
  const totalDoctors = doctors.length;

  const appointmentsByHospital = await Appointment.aggregate([
    {
      $group: {
        _id: "$hospital",
        count: { $sum: 1 },
      },
    },
  ]);

  // to-do speciality selection

  return res.json({
    totalPatients,
    totalAppointments,
    totalDoctors,
    appointmentsByHospital,
  });
});

adminRouter.get("/admin-dash", async (req, res) => {
  const results = await axios.get("http://localhost:5000/admin/metrics");
  console.log(results.data.appointmentsByHospital);
  res.render("admin-dash", {
    totalPatients: results.data.totalPatients,
    totalDoctors: results.data.totalDoctors,
    totalAppointments: results.data.totalAppointments,
  });
});

adminRouter.get("/allAppointments", (req, res) => {
  res.render("admin-appointments-dash", {
    errorMessage: null,
    successMessage: null,
  });
});

adminRouter.get("/allDoctors", (req, res) => {
  res.render("admin-hospitals", {
    errorMessage: null,
    successMessage: null,
  });
});

adminRouter.get("/allPatients", (req, res) => {
  res.render("admin-patients", {
    errorMessage: null,
    successMessage: null,
  });
});

adminRouter.get("/getAppointments", async (req, res) => {
  const appointments = await Appointment.find().sort({ date: -1 });

  const apps = appointments.map((a) => ({
    username: a.username,
    date: a.date,
    hospital: a.hospital,
    slot: a.slot,
  }));

  res.send(apps);
});

adminRouter.get("/getDoctors", async (req, res) => {
  const doctors = await Doctor.find();
  return res.json(doctors);
});

adminRouter.get("/getDoc-hosp", async (req, res) => {
  try {
    const selectedHospital = req.query.hospital;
    // Find all doctors associated with the selected hospital
    const doctors = await Doctor.find({ hospital: selectedHospital });
    res.json(doctors);
  } catch (error) {
    console.error("Error fetching doctors:", error);
    res.status(500).json({ error: "Error fetching doctors" });
  }
});

adminRouter.post("/addDoctor", async (req, res) => {
  const { name, speciality, phone, hospital } = req.body;

  try {
    // Find the hospital by name
    const existingHospital = await Hospital.findOne({ name: hospital });
    if (!existingHospital) {
      return res.status(400).json({ message: "Hospital not found" });
    }

    // Create a new doctor instance with the provided details and hospital reference
    const doctor = new Doctor({
      name,
      speciality,
      phone,
      hospital: existingHospital.name, // Assign the hospital's ObjectId
    });

    // Save the doctor to the database
    await doctor.save();

    // Update the hospital's doctors array with the new doctor's ObjectId
    existingHospital.doctors.push(doctor._id);
    await existingHospital.save();

    return res.status(200).json({ message: "Doctor added successfully" });
  } catch (error) {
    console.error("Error adding doctor:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

adminRouter.delete("/deleteDoctor/:id", async (req, res) => {
  try {
    // Find the doctor to be deleted
    const doctor = await Doctor.findById(req.params.id);
    if (!doctor) {
      return res.status(404).json({ error: "Doctor not found" });
    }

    // Find the hospital to which the doctor belongs
    const hospital = await Hospital.findOneAndUpdate(
      { doctors: req.params.id },
      { $pull: { doctors: req.params.id } },
      { new: true }
    );

    // Delete the doctor
    await doctor.delete();

    return res.json({ message: "Doctor deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error deleting doctor" });
  }
});

// adminRouter.get("/getUsers", async (req, res) => {
//   const users = await User.find();
//   return res.json(users);
// });

adminRouter.get("/getPatients", async (req, res) => {
  const patients = await User.find();

  const apps = patients.map((a) => ({
    username: a.username,
    name: a.name,
    phone: a.phone,
    email: a.email,
    age: a.age,
    gender: a.gender,
    _id: a._id,
  }));

  res.send(apps);
});

adminRouter.delete("/deletePatient/:id", async (req, res) => {
  try {
    const patient = await User.findByIdAndDelete(req.params.id);
    if (!patient) {
      return res.status(404).json({ error: "Patient not found" });
    }
    return res.json({ message: "Patient deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error deleting patient" });
  }
});

adminRouter.get("/getHospitals", async (req, res) => {
  const hospitals = await Hospital.find();
  return res.json(hospitals);
});

adminRouter.delete("/deleteHospital/:id", async (req, res) => {
  try {
    const hospital = await Hospital.findByIdAndDelete(req.params.id);
    if (!hospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    return res.json({ message: "Hospital deleted successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error deleting hospital" });
  }
});

adminRouter.put("/updateHospital/:id", async (req, res) => {
  try {
    const { name, address, doctors } = req.body;

    // Convert the array of doctor IDs to an array of ObjectIds
    const doctorIds = doctors
      ? doctors.map((doctorId) => new mongoose.Types.ObjectId(doctorId))
      : [];

    const updatedHospital = await Hospital.findByIdAndUpdate(
      req.params.id,
      { name, address, doctors: doctorIds },
      { new: true }
    );

    if (!updatedHospital) {
      return res.status(404).json({ error: "Hospital not found" });
    }
    return res.json({
      message: "Hospital updated successfully",
      updatedHospital,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error updating hospital" });
  }
});

adminRouter.post("/addHospital", async (req, res) => {
  const { name, address, doctors } = req.body;

  try {
    // Convert the array of doctor IDs to an array of ObjectIds
    const doctorIds = doctors.map(
      (doctorId) => new mongoose.Types.ObjectId(doctorId)
    );

    const hospital = new Hospital({
      name,
      address,
      doctors: doctorIds,
    });

    await hospital.save();
    return res.json({ message: "Hospital added successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Error adding hospital" });
  }
});

adminRouter.get("/filterByHospital", async (req, res) => {
  const hospital = req.query.hospital;
  if (hospital === "All") {
    const doctor = await Doctor.find();
    return res.json(doctor);
  }
  const doctor = await Doctor.find({ hospital: hospital });
  return res.json(doctor);
});

adminRouter.get("/filterByHospital-appointment", async (req, res) => {
  const hospital = req.query.hospital;
  if (hospital === "All") {
    const doctor = await Appointment.find();
    return res.json(doctor);
  }
  const doctor = await Appointment.find({ hospital: hospital });
  return res.json(doctor);
});

adminRouter.get("/filterBySpeciality", async (req, res) => {
  const spec = req.query.speciality;
  if (spec === "All") {
    const doctor = await Doctor.find();
    return res.json(doctor);
  }
  const doctor = await Doctor.find({
    speciality: spec,
  });
  return res.json(doctor);
});

module.exports = adminRouter;
