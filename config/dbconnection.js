const mongoose = require("mongoose");

require('dotenv').config();

const mongodbUri = process.env.MONGODB_URI;

mongoose
  .connect(mongodbUri, {
    dbName: "userDB",
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongodb connected");
  })
  .catch((err) => {
    console.log("Error" + err.message);
  });

mongoose.hospitalDB = mongoose.createConnection(mongodbUri, {
  dbName: "hospitalDB",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.appointmentDB = mongoose.createConnection(mongodbUri, {
  dbName: "appointmentDB",
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

module.exports = mongoose;
