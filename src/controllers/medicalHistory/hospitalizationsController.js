const hospitalizations = require("../../models/MedicalHistories/hospitalizations");
const MedicalHistory = require("../../models/MedicalHistory");

// Create a new hospitalization record
exports.createHospitalization = async (req, res) => {
  try {
    const newHospitalization = await hospitalizations.create({
      hospitalName: req.body.hospitalName,
      reasonOfHospitalization: req.body.reasonOfHospitalization,
      admissionDate: req.body.admissionDate,
      dischargeDate: req.body.dischargeDate,
      nameOfAttendingPhysician: req.body.nameOfAttendingPhysician,
    });
    const updatedMedicalHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { hospitalizations: newHospitalization } },
      { new: true }
    );

    if (!updatedMedicalHistory) {
      return res.status(404).json({ message: "Medical history not created" });
    }

    res.status(201).json(updatedMedicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all hospitalizations for a user
exports.getHospitalizations = async (req, res) => {
  try {
    const hospitalizations = await MedicalHistory.findOne({
      userId: req.params.userId,
    }).select("hospitalizations");
    res.status(200).json(hospitalizations);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific hospitalization record by ID
exports.getHospitalizationById = async (req, res) => {
  try {
    const hospitalization = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!hospitalization) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const hospitalizationRecord = hospitalization.hospitalizations.find(
      (hospitalization) => {
        if (hospitalization._id) {
          const hospitalizationIdStr = hospitalization._id.toString();
          const paramIdStr = req.params.id.toString();
          return hospitalizationIdStr === paramIdStr;
        }
        return false;
      }
    );

    res.status(200).json(hospitalizationRecord);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific hospitalization record by ID
exports.updateHospitalization = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const hospitalization = medicalHistory.hospitalizations.find(
      (hospitalization) => {
        if (hospitalization._id) {
          const hospitalizationIdStr = hospitalization._id.toString();
          const paramIdStr = req.params.id.toString();
          return hospitalizationIdStr === paramIdStr;
        }
        return false;
      }
    );

    if (!hospitalization) {
      return res.status(404).json({ message: "Hospitalization not found" });
    }

    // Update only the fields provided in the request body
    if (req.body.hospitalName)
      hospitalization.hospitalName = req.body.hospitalName;
    if (req.body.reasonOfHospitalization)
      hospitalization.reasonOfHospitalization =
        req.body.reasonOfHospitalization;
    if (req.body.admissionDate)
      hospitalization.admissionDate = req.body.admissionDate;
    if (req.body.dischargeDate)
      hospitalization.dischargeDate = req.body.dischargeDate;
    if (req.body.nameOfAttendingPhysician)
      hospitalization.nameOfAttendingPhysician =
        req.body.nameOfAttendingPhysician;

    medicalHistory.markModified("hospitalizations");

    await medicalHistory.save();

    res.status(200).json(hospitalization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific hospitalization record by ID
exports.deleteHospitalization = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const hospitalizationIndex = medicalHistory.hospitalizations.findIndex(
      (hospitalization) => {
        if (hospitalization._id) {
          return hospitalization._id.toString() === req.params.id;
        }
        return false;
      }
    );

    if (hospitalizationIndex === -1) {
      return res.status(404).json({ message: "Hospitalization not found" });
    }

    medicalHistory.hospitalizations.splice(hospitalizationIndex, 1);

    await medicalHistory.save();

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
