const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const axios = require("axios");
const bcrypt = require("bcrypt");

const authRouter = express.Router();

const User = require("../models/user");

// User route

authRouter.get("/appointment-history", (req, res) => {
  res.render("appointment-history", {
    errorMessage: null,
    successMessage: null,
  });
});

authRouter.get("/login", (req, res) => {
  res.render("login", { errorMessage: null, successMessage: null });
});

authRouter.get("/signup", (req, res) => {
  res.render("signup");
});

authRouter.get("/admin-login", (req, res) => {
  res.render("admin-login", { errorMessage: null, successMessage: null });
});

authRouter.get("/user-details", (req, res) => {
  res.render("user-details", { errorMessage: null, successMessage: null });
});
authRouter.post("/signup", async (req, res) => {
  const data = {
    username: req.body.username,
    name: req.body.name,
    password: req.body.password,
    phone: req.body.phone,
  };

  // Check if the username already exists in the database
  const existingUser = await User.findOne({
    username: data.username,
  });

  if (existingUser) {
    res.send("User already exists. Please choose a different username.");
  } else {
    // Validate phone number
    if (data.phone.length !== 10) {
      res.render("signup", {
        errorMessage: "Phone number must be 10 digits.",
        successMessage: null,
      });
      return;
    }

    // Validate password
    const passwordRegex =
      /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[!@#$%&*()-+=^])(?!.*\s).{8,15}$/;
    if (!passwordRegex.test(data.password)) {
      res.render("signup", {
        errorMessage: "Password must meet the criteria.",
        successMessage: null,
      });
      return;
    }

    // Hash the password using bcrypt
    const saltRounds = 10; // Number of salt rounds for bcrypt
    const hashedPassword = await bcrypt.hash(data.password, saltRounds);

    data.password = hashedPassword; // Replace the original password with the hashed one

    const userdata = await User.insertMany(data);
    console.log(userdata);
    res.render("login", {
      errorMessage: null,
      successMessage: "User account created successfully, please login now!",
    });
  }
});

// Login user
authRouter.post("/login", async (req, res) => {
  try {
    const check = await User.findOne({ username: req.body.username });
    if (!check) {
      res.render("login", {
        errorMessage: "Username cannot be found",
        successMessage: null,
      });
      return;
    }
    // Compare the hashed password from the database with the plaintext password
    const isPasswordMatch = await bcrypt.compare(
      req.body.password,
      check.password
    );
    if (!isPasswordMatch) {
      res.render("login", {
        errorMessage: "Incorrect password",
        successMessage: null,
      });
      return;
    }
    // Successful login

    console.log("Login successful");
    res.render("dash", { userData: JSON.stringify(check) });
  } catch (error) {
    console.error("Login error:", error);
    res.render("login", {
      errorMessage: "An error occurred. Please try again later.",
      successMessage: null,
    });
  }
});

module.exports = authRouter;
