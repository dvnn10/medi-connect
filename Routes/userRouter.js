const express = require("express");
const bodyParser = require("body-parser");
const mongodb = require("mongodb");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("../models/user");

const userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.get("/getUserDetails/:id", async (req, res) => {
  const userId = req.params.id;

  const userDetails = await User.findById(userId);
  const user = {
    id: userDetails._id,
    username: userDetails.username,
    name: userDetails.name,
    age: userDetails.age,
    gender: userDetails.gender,
    allergy: userDetails.allergy,
    phone: userDetails.phone,
    email: userDetails.email,
  };
  return res.send(user);
});


const { ObjectId } = require('mongoose').Types;

userRouter.put("/editUserDetails/:id", async (req, res) => {
  
  const userId = req.params.id;
  const userDetails = req.body.user;
  console.log(userId)
  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          username: userDetails.username,
          name: userDetails.name,
          age: userDetails.age,
          gender: userDetails.gender,
          allergy: userDetails.allergy,
          phone: userDetails.phone,
          email: userDetails.email,
        },
      },
      { new: true }
    );
    res.status(200).json(updatedUser);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: error.message });
  }
});
module.exports = userRouter;
