const MedicalHistory = require("../../models/MedicalHistory");

// Create a new social history entry
exports.createSocialHistory = async (req, res) => {
  try {
    const newEntry = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { socialHistory: req.body } },
      { new: true }
    );
    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all social history entries for a user
exports.getSocialHistories = async (req, res) => {
  try {
    const histories = await MedicalHistory.findOne({
      userId: req.params.userId,
    }).select("socialHistory");
    res.status(200).json(histories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific social history entry by ID
exports.getSocialHistoryById = async (req, res) => {
  try {
    const history = await MedicalHistory.findOne(
      { userId: req.params.userId, "socialHistory._id": req.params.id },
      { "socialHistory.$": 1 }
    );
    res.status(200).json(history);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific social history entry by ID
exports.updateSocialHistory = async (req, res) => {
  try {
    const updatedEntry = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId, "socialHistory._id": req.params.id },
      { $set: { "socialHistory.$": req.body } },
      { new: true }
    );
    res.status(200).json(updatedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific social history entry by ID
exports.deleteSocialHistory = async (req, res) => {
  try {
    const updatedHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { socialHistory: { _id: req.params.id } } },
      { new: true }
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
