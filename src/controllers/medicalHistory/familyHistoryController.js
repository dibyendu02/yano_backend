const MedicalHistory = require("../../models/MedicalHistory");

// Create a new family history entry
exports.createFamilyHistory = async (req, res) => {
  try {
    const newEntry = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { familyHistory: req.body } },
      { new: true }
    );
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all family history entries for a user
exports.getFamilyHistories = async (req, res) => {
  try {
    const histories = await MedicalHistory.findOne({
      userId: req.params.userId,
    }).select("familyHistory");
    res.status(200).json(histories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific family history entry by ID
exports.getFamilyHistoryById = async (req, res) => {
  try {
    const history = await MedicalHistory.findOne(
      { userId: req.params.userId, "familyHistory._id": req.params.id },
      { "familyHistory.$": 1 }
    );
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific family history entry by ID
exports.updateFamilyHistory = async (req, res) => {
  try {
    const updatedEntry = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId, "familyHistory._id": req.params.id },
      { $set: { "familyHistory.$": req.body } },
      { new: true }
    );
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific family history entry by ID
exports.deleteFamilyHistory = async (req, res) => {
  try {
    const updatedHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { familyHistory: { _id: req.params.id } } },
      { new: true }
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
