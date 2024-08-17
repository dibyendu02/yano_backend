const express = require("express");
const router = express.Router();
const {
  signup,
  doctorLogin,
  findDoctorById,
  getAllDoctors,
  updateDoctor,
} = require("../controllers/userDoctorControllers");
const { singleUpload } = require("../middlewares/multer");

// Signup route
router.post("/signup", singleUpload, signup);
//update
router.put("/:id", singleUpload, updateDoctor);
router.post("/login", doctorLogin);
// Find doctor by ID route
router.get("/:id", findDoctorById);

// get all doctors
router.get("/", getAllDoctors);

module.exports = router;
