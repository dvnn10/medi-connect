const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");

const appointmentBookRouter = express.Router();

const Appointment = require("../models/appointment");

appointmentBookRouter
  .route("/")
  .get((req, res) => {
    res.render("Appointment-form");
  })
  .post(async(req, res) => {
    const username = req.body.username;
    const date = req.body.date;
    const hospital = req.body.hospital;
    const doctor = req.body.doctor;
    const slot = req.body.slot;

    const existingAppointment = await Appointment.findOne({ doctor,date,slot,hospital });

    if (existingAppointment) {
      // User with the same username and slot already exists
      return res.status(400).send("Appointment already exists for this user and slot");      
    } 

    
    const newApp = new Appointment({
      username: username,
      date: date,
      hospital: hospital,
      doctor:doctor,
      slot: slot,
    });

    newApp.save((err) => {
      if (err) {
        console.log(err);
      } else {
        // console.log("Appointment successful");
        console.log(newApp);
        res.json(newApp);
        //res.render("Appointment-form");
      }
    });
  });

module.exports = appointmentBookRouter;
