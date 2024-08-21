const medicine = require("../../models/MedicalHistories/medicine");
const MedicalHistory = require("../../models/MedicalHistory");

// Create a new medicine
exports.createMedicine = async (req, res) => {
  try {
    // Create a new medicine document
    const newMedicine = await medicine.create({
      medicineName: req.body.medicineName,
      formOfMedication: req.body.formOfMedication,
      doses: req.body.doses,
      duration: req.body.duration,
      additionalInformation: req.body.additionalInformation,
    });

    // Update the MedicalHistory document by pushing the newly created medicine
    const updatedMedicalHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { medicines: newMedicine } },
      { new: true }
    );

    if (!updatedMedicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    res.status(201).json(updatedMedicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all medicines for a user
exports.getMedicines = async (req, res) => {
  try {
    const medicines = await MedicalHistory.findOne({
      userId: req.params.userId,
    }).select("medicines");
    res.status(200).json(medicines);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific medicine by ID
exports.getMedicineById = async (req, res) => {
  try {
    const medicine = await MedicalHistory.findOne(
      { userId: req.params.userId, "medicines._id": req.params.id },
      { "medicines.$": 1 }
    );
    res.status(200).json(medicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific medicine by ID
exports.updateMedicine = async (req, res) => {
  try {
    const updatedMedicine = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId, "medicines._id": req.params.id },
      { $set: { "medicines.$": req.body } },
      { new: true }
    );
    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific medicine by ID
exports.deleteMedicine = async (req, res) => {
  try {
    const updatedHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.params.userId },
      { $pull: { medicines: { _id: req.params.id } } },
      { new: true }
    );
    res.status(200).json(updatedHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
