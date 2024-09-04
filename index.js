const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const cloudinary = require("cloudinary");

//import routes
const authRoutes = require("./src/routes/login.js");
const doctorRoutes = require("./src/routes/userDoctor.js");
const patientRoutes = require("./src/routes/userPatient.js");
const bloodGlucoseRoutes = require("./src/routes/bloodGlucoseRoutes.js");
const bloodPressureRoutes = require("./src/routes/bloodPressureRoutes.js");
const bloodOxygenRoutes = require("./src/routes/bloodOxygenRoutes.js");
const heartRateRoutes = require("./src/routes/heartRateRoutes.js");
const bodyTempRoutes = require("./src/routes/bodyTempRoutes.js");
const ecgRoutes = require("./src/routes/ecgRoutes.js");
const healthConditionsRoutes = require("./src/routes/medicalHistory/healthConditionsRoutes");
const familyHistoryRoutes = require("./src/routes/medicalHistory/familyHistoryRoutes");
const allergiesRoutes = require("./src/routes/medicalHistory/allergiesRoutes");
const medicinesRoutes = require("./src/routes/medicalHistory/medicinesRoutes");
const surgeriesRoutes = require("./src/routes/medicalHistory/surgeriesRoutes");
const vaccinesRoutes = require("./src/routes/medicalHistory/vaccinesRoutes");
const hospitalizationsRoutes = require("./src/routes/medicalHistory/hospitalizationsRoutes");
const socialHistoryRoutes = require("./src/routes/medicalHistory/socialHistoryRoutes");
const medicalHistoryRoutes = require("./src/routes/medicalHistoryRoute");
const changePasswordRoutes = require("./src/routes/changePasswordRoutes");
const patientAddFamilyMemberRoutes = require("./src/routes/patientAddFamilyMemberRoutes");
const MeasurementUnitsRoutes = require("./src/routes/MeasurementUnitsRoutes.js");

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

// Middleware to parse JSON bodies
// app.use(express.json());

app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
);

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
app.use("/api", authRoutes);
app.use("/api/userdoctor", doctorRoutes);
app.use("/api/userpatient", patientRoutes);
app.use("/api/blood-glucose", bloodGlucoseRoutes);
app.use("/api/blood-pressure", bloodPressureRoutes);
app.use("/api/blood-oxygen", bloodOxygenRoutes);
app.use("/api/heart-rate", heartRateRoutes);
app.use("/api/body-temp", bodyTempRoutes);
app.use("/api/ecg", ecgRoutes);
app.use("/api/healthConditions", healthConditionsRoutes);
app.use("/api/familyHistory", familyHistoryRoutes);
app.use("/api/allergies", allergiesRoutes);
app.use("/api/medicines", medicinesRoutes);
app.use("/api/surgeries", surgeriesRoutes);
app.use("/api/vaccines", vaccinesRoutes);
app.use("/api/hospitalizations", hospitalizationsRoutes);
app.use("/api/socialHistory", socialHistoryRoutes);
app.use("/api/medicalHistory", medicalHistoryRoutes);
app.use("/api/changePassword", changePasswordRoutes);
app.use("/api/patientAddFamilyMember", patientAddFamilyMemberRoutes);
app.use("/api/measurementunits", MeasurementUnitsRoutes);

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
