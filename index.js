const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cloudinary = require("cloudinary");

//import routes
const doctorRoutes = require("./src/routes/userDoctor.js");
const patientRoutes = require("./src/routes/userPatient.js");
const bloodGlucoseRoutes = require("./src/routes/bloodGlucoseRoutes.js");
const bloodPressureRoutes = require("./src/routes/bloodPressureRoutes.js");
const bloodOxygenRoutes = require("./src/routes/bloodOxygenRoutes.js");
const heartRateRoutes = require("./src/routes/heartRateRoutes.js");
const bodyTempRoutes = require("./src/routes/bodyTempRoutes.js");
const ecgRoutes = require("./src/routes/ecgRoutes.js");

dotenv.config();
const app = express();

//select port
const PORT = process.env.PORT || 5001;

//cloudinary config
cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

//databse connection
const connectionParams = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
};

mongoose
  .connect(process.env.MONGO_URI, connectionParams)
  .then(() => {
    console.log("DB connection successfull!");
  })
  .catch((err) => {
    console.log(err);
  });

//allow to send json
app.use(express.json());
app.use(cors());

//routes
app.use("/api/userdoctor", doctorRoutes);
app.use("/api/userpatient", patientRoutes);
app.use("/api/blood-glucose", bloodGlucoseRoutes);
app.use("/api/blood-pressure", bloodPressureRoutes);
app.use("/api/blood-oxygen", bloodOxygenRoutes);
app.use("/api/heart-rate", heartRateRoutes);
app.use("/api/body-temp", bodyTempRoutes);
app.use("/api/ecg", ecgRoutes);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
