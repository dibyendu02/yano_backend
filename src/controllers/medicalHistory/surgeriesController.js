const surgeries = require("../../models/MedicalHistories/surgeries");
const MedicalHistory = require("../../models/MedicalHistory");

// Create a new surgery
exports.createSurgery = async (req, res) => {
  try {
    const surgery = await surgeries.create({
      surgeryName: req.body.surgeryName,
      supportDevices: req.body.supportDevices,
      dateOfSurgery: req.body.dateOfSurgery,
      physicianInCharge: req.body.physicianInCharge,
      additionalNotes: req.body.additionalNotes,
    });
    const newSurgery = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { surgeries: surgery } },
      { new: true }
    );

    if (!newSurgery) {
      return res.status(404).json({ message: "Medical history not found" });
    }
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
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const surgery = medicalHistory.surgeries.find((surgery) => {
      if (surgery._id) {
        const surgeryIdStr = surgery._id.toString();
        const paramIdStr = req.params.id.toString();
        return surgeryIdStr === paramIdStr;
      }
      return false;
    });

    if (!surgery) {
      return res.status(404).json({ message: "Surgery not found" });
    }

    res.status(200).json(surgery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.updateSurgery = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const surgery = medicalHistory.surgeries.find((surgery) => {
      if (surgery._id) {
        const surgeryIdStr = surgery._id.toString();
        const paramIdStr = req.params.id.toString();
        return surgeryIdStr === paramIdStr;
      }
      return false;
    });

    if (!surgery) {
      return res.status(404).json({ message: "Surgery not found" });
    }

    // Update only the fields provided in the request body
    if (req.body.surgeryName) surgery.surgeryName = req.body.surgeryName;
    if (req.body.supportDevices)
      surgery.supportDevices = req.body.supportDevices;
    if (req.body.dateOfSurgery) surgery.dateOfSurgery = req.body.dateOfSurgery;
    if (req.body.physicianInCharge)
      surgery.physicianInCharge = req.body.physicianInCharge;
    if (req.body.additionalNotes)
      surgery.additionalNotes = req.body.additionalNotes;

    medicalHistory.markModified("surgeries");

    await medicalHistory.save();

    res.status(200).json(surgery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific surgery by ID
exports.deleteSurgery = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const surgeryIndex = medicalHistory.surgeries.findIndex((surgery) => {
      if (surgery._id) {
        return surgery._id.toString() === req.params.id;
      }
      return false;
    });

    if (surgeryIndex === -1) {
      return res.status(404).json({ message: "Surgery not found" });
    }

    medicalHistory.surgeries.splice(surgeryIndex, 1);

    await medicalHistory.save();

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
