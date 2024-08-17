const MedicalHistory = require("../../models/MedicalHistory");
const HealthConditionsSchema = require("../../models/MedicalHistories/healthConditions");

// Create a new health condition
exports.createHealthCondition = async (req, res) => {
  try {
    const newCondition = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { healthConditions: req.body } },
      { new: true }
    );
    res.status(201).json(newCondition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all health conditions for a user
exports.getHealthConditions = async (req, res) => {
  try {
    const conditions = await MedicalHistory.findOne({
      userId: req.params.userId,
    }).select("healthConditions");
    res.status(200).json(conditions);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific health condition by ID
exports.getHealthConditionById = async (req, res) => {
  try {
    const condition = await MedicalHistory.findOne(
      { userId: req.params.userId, "healthConditions._id": req.params.id },
      { "healthConditions.$": 1 }
    );
    res.status(200).json(condition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific health condition by ID
exports.updateHealthCondition = async (req, res) => {
  try {
    const updatedCondition = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId, "healthConditions._id": req.params.id },
      { $set: { "healthConditions.$": req.body } },
      { new: true }
    );
    res.status(200).json(updatedCondition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific health condition by ID
exports.deleteHealthCondition = async (req, res) => {
  try {
    const updatedHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { healthConditions: { _id: req.params.id } } },
      { new: true }
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
