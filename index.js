  const express = require("express");
  const bodyParser = require("body-parser");
  const mongodb = require("mongodb");
  const mongoose = require("mongoose");
  const cors = require("cors");

  const app = express();


  app.use(express.static(__dirname + "/public"));
  app.use(express.static("public"));
  app.use(bodyParser.json());
  app.set("view engine", "ejs");
  app.use(bodyParser.urlencoded({ extended: true }));

  app.use(cors());

  // Home route

  app.route("/").get((req, res) => {
    res.render("landing");
  });

  app.get("/dash", (req, res) => {
    res.render("dash", { userData: null });
  });

  // Admin login route

  /*
  app
    .route("/login")
    .get((req, res) => {
      res.render("Admin-login");
    })
    .post((req, res) => {
      const email = req.body.email;
      const pass = req.body.password;

      if (email === "admin@bookmydose.com" && pass === "1234") {
        //console.log("Success!");
        res.sendFile(__dirname + "/public/Admin-dashboard.html");
      } else {
        res.sendFile(__dirname + "/public/login-failure.html");
        //console.log("Failure!");
      }
    });
  */

  // Authentication route
  const authRouter = require("./Routes/authRouter");
  app.use("/auth", authRouter);

  // Users-registration DB
  const appointmentBookRouter = require("./Routes/appointmentBookRouter");
  app.use("/appointment", appointmentBookRouter);

  //   User route
  // const userRouter = require("./Routes/userlistRouter");
  // app.use("/users", userRouter);

  // Hospital-registration route

  const HospitalRouter = require("./Routes/HospitallistRouter");
  app.use("/hospital", HospitalRouter);

  const adminRouter = require("./Routes/adminRoutes");
  app.use("/admin", adminRouter);

  const userRouter = require("./Routes/userRouter");
  app.use("/user", userRouter);


  const PORT = 5000;

  app.listen(PORT, function () {
    console.log(`Server started on port ${PORT}`);
    console.log(`Open your browser and click here: \x1b]8;;http://localhost:${PORT}\x1b\\localhost:${PORT}\x1b]8;;\x1b\\`);
  });

  // "C:\Program Files\MongoDB\Server\4.4\bin\mongod.exe" --dbpath="c:\data\db"
