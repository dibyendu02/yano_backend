const MedicalHistory = require("../../models/MedicalHistory");

// Create a new allergy
exports.createAllergy = async (req, res) => {
  try {
    const newAllergy = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { allergies: req.body } },
      { new: true }
    );
    res.status(201).json(newAllergy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all allergies for a user
exports.getAllergies = async (req, res) => {
  try {
    const allergies = await MedicalHistory.findOne({
      userId: req.params.userId,
    }).select("allergies");
    res.status(200).json(allergies);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific allergy by ID
exports.getAllergyById = async (req, res) => {
  try {
    const allergy = await MedicalHistory.findOne(
      { userId: req.params.userId, "allergies._id": req.params.id },
      { "allergies.$": 1 }
    );
    res.status(200).json(allergy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific allergy by ID
exports.updateAllergy = async (req, res) => {
  try {
    const updatedAllergy = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId, "allergies._id": req.params.id },
      { $set: { "allergies.$": req.body } },
      { new: true }
    );
    res.status(200).json(updatedAllergy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific allergy by ID
exports.deleteAllergy = async (req, res) => {
  try {
    const updatedHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { allergies: { _id: req.params.id } } },
      { new: true }
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
