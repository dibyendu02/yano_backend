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
    const medicine = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const specificMedicine = medicine.medicines.find((medicine) => {
      // console.log(medicine._id);
      if (medicine._id) {
        const medicineIdStr = medicine._id.toString();
        const paramIdStr = req.params.id.toString();
        return medicineIdStr == paramIdStr;
      }
      return false;
    });
    if (!specificMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    res.status(200).json(specificMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific medicine by ID
exports.updateMedicine = async (req, res) => {
  try {
    const updatedMedicine = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!updatedMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    const specificMedicine = updatedMedicine.medicines.find((medicine) => {
      if (medicine._id) {
        const medicineIdStr = medicine._id.toString();
        const paramIdStr = req.params.id.toString();
        return medicineIdStr == paramIdStr;
      }
      return false;
    });

    if (!specificMedicine) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    if (req.body.medicineName)
      specificMedicine.medicineName = req.body.medicineName;
    if (req.body.formOfMedication)
      specificMedicine.formOfMedication = req.body.formOfMedication;
    if (req.body.doses) specificMedicine.doses = req.body.doses;
    if (req.body.duration) specificMedicine.duration = req.body.duration;
    if (req.body.additionalInformation)
      specificMedicine.additionalInformation = req.body.additionalInformation;

    updatedMedicine.markModified("medicines");
    await updatedMedicine.save();

    res.status(200).json(updatedMedicine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific medicine by ID
exports.deleteMedicine = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const medicineIndex = medicalHistory.medicines.findIndex((medicine) => {
      if (medicine._id) {
        return medicine._id.toString() === req.params.id;
      }
      return false;
    });

    if (medicineIndex === -1) {
      return res.status(404).json({ message: "Medicine not found" });
    }

    medicalHistory.medicines.splice(medicineIndex, 1);

    await medicalHistory.save();

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
