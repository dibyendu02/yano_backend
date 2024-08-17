const MedicalHistory = require("../../models/MedicalHistory");

// Create a new surgery
exports.createSurgery = async (req, res) => {
  try {
    const newSurgery = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { surgeries: req.body } },
      { new: true }
    );
    res.status(201).json(newSurgery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all surgeries for a user
exports.getSurgeries = async (req, res) => {
  try {
    const surgeries = await MedicalHistory.findOne({
      userId: req.params.userId,
    }).select("surgeries");
    res.status(200).json(surgeries);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific surgery by ID
exports.getSurgeryById = async (req, res) => {
  try {
    const surgery = await MedicalHistory.findOne(
      { userId: req.params.userId, "surgeries._id": req.params.id },
      { "surgeries.$": 1 }
    );
    res.status(200).json(surgery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific surgery by ID
exports.updateSurgery = async (req, res) => {
  try {
    const updatedSurgery = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId, "surgeries._id": req.params.id },
      { $set: { "surgeries.$": req.body } },
      { new: true }
    );
    res.status(200).json(updatedSurgery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific surgery by ID
exports.deleteSurgery = async (req, res) => {
  try {
    const updatedHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { surgeries: { _id: req.params.id } } },
      { new: true }
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
