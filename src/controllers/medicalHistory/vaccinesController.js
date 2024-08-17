const MedicalHistory = require("../../models/MedicalHistory");

// Create a new vaccine record
exports.createVaccine = async (req, res) => {
  try {
    const newVaccine = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { vaccines: req.body } },
      { new: true }
    );
    res.status(201).json(newVaccine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all vaccines for a user
exports.getVaccines = async (req, res) => {
  try {
    const vaccines = await MedicalHistory.findOne({
      userId: req.params.userId,
    }).select("vaccines");
    res.status(200).json(vaccines);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific vaccine record by ID
exports.getVaccineById = async (req, res) => {
  try {
    const vaccine = await MedicalHistory.findOne(
      { userId: req.params.userId, "vaccines._id": req.params.id },
      { "vaccines.$": 1 }
    );
    res.status(200).json(vaccine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific vaccine record by ID
exports.updateVaccine = async (req, res) => {
  try {
    const updatedVaccine = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId, "vaccines._id": req.params.id },
      { $set: { "vaccines.$": req.body } },
      { new: true }
    );
    res.status(200).json(updatedVaccine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific vaccine record by ID
exports.deleteVaccine = async (req, res) => {
  try {
    const updatedHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { vaccines: { _id: req.params.id } } },
      { new: true }
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
