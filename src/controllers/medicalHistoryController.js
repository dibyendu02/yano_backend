const MedicalHistory = require("../models/MedicalHistory");

// Create a new medical history
exports.createMedicalHistory = async (req, res) => {
  try {
    const newHistory = new MedicalHistory(req.body);
    await newHistory.save();
    res.status(201).json(newHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all medical history for a user
exports.getMedicalHistory = async (req, res) => {
  try {
    const history = await MedicalHistory.findOne({ userId: req.params.userId });
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
