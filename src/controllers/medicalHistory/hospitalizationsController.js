const MedicalHistory = require("../../models/MedicalHistory");

// Create a new hospitalization record
exports.createHospitalization = async (req, res) => {
  try {
    const newHospitalization = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { hospitalizations: req.body } },
      { new: true }
    );
    res.status(201).json(newHospitalization);
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
    const hospitalization = await MedicalHistory.findOne(
      { userId: req.params.userId, "hospitalizations._id": req.params.id },
      { "hospitalizations.$": 1 }
    );
    res.status(200).json(hospitalization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific hospitalization record by ID
exports.updateHospitalization = async (req, res) => {
  try {
    const updatedHospitalization = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId, "hospitalizations._id": req.params.id },
      { $set: { "hospitalizations.$": req.body } },
      { new: true }
    );
    res.status(200).json(updatedHospitalization);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific hospitalization record by ID
exports.deleteHospitalization = async (req, res) => {
  try {
    const updatedHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { hospitalizations: { _id: req.params.id } } },
      { new: true }
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
