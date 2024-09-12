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
    // Try to find the medical history for the user
    let history = await MedicalHistory.findOne({ userId: req.params.userId });

    // If no medical history exists, create a new one
    if (!history) {
      const newHistoryData = {
        userId: req.params.userId,
      };

      history = new MedicalHistory(newHistoryData);
      await history.save();

      return res.status(201).json(history);
    }

    // If found, return the existing medical history
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
