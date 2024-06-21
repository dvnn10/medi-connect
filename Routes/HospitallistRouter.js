const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");

const HospitalRouter = express.Router();

const Hospital = require("../models/hospital");

const H1 = new Hospital({
  name: "Asian Heart Institute",
  address: "Bandra-Kurla Complex",
  doctors: [],
});

const H2 = new Hospital({
  name: "Bhabha Hospital",
  address: "Bandra",
  doctors: [],
});
const H3 = new Hospital({
  name: "Bhaktivedanta Hospital",
  address: "Mira Road",
  doctors: [],
});
const H4 = new Hospital({
  name: "Bombay Hospital",
  address: "Marine Lines",
  doctors: [],
});
const H5 = new Hospital({
  name: "Cloudnine Hospitals",
  address: "Link Road, Malad West",
  doctors: [],
});

const addedHospitals = [H1, H2, H3, H4, H5];

//   Hospital route
HospitalRouter.route("/").get((req, res) => {
  Hospital.find({}, (err, foundItems) => {
    if (foundItems.length === 0) {
      Hospital.insertMany(addedHospitals, (err) => {
        if (err) {
          console.log(err);
        } else {
          console.log("Added Default Hospitals!");
        }
      });
      res.redirect("Hospital-list");
    } else {
      res.render("Hospital-list", { hospitals: addedHospitals });
    }
  });
});

module.exports = HospitalRouter;
