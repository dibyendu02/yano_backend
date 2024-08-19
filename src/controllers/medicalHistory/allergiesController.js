const allergies = require("../../models/MedicalHistories/allergies");
const MedicalHistory = require("../../models/MedicalHistory");

// Create a new allergy
exports.createAllergy = async (req, res) => {
  try {
    // Create the allergy entry
    const allergy = await allergies.create({
      nameOfTheAllergy: req.body.nameOfTheAllergy,
      details: req.body.details,
      moreDetails: req.body.moreDetails,
      treatedBy: req.body.treatedBy,
      dateOfFirstDiagnosis: req.body.dateOfFirstDiagnosis,
      medicine: req.body.medicine,
      notes: req.body.notes,
    });

    // Update the user's medical history by adding the newly created allergy
    const newAllergy = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { allergies: allergy } },
      { new: true }
    );

    // Respond with the updated medical history
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
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }
    const allergy = medicalHistory.allergies.find((allergy) => {
      if (allergy._id) {
        const allergyIdStr = allergy._id.toString();
        const paramIdStr = req.params.id.toString();
        return allergyIdStr === paramIdStr;
      }
      return false;
    });

    if (!allergy) {
      res.status(404).json({ message: "Allergy not found" });
    }
    if (!allergy) {
      return res.status(404).json({ message: "Allergy not found" });
    }
    res.status(200).json(allergy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific allergy by ID
exports.updateAllergy = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const allergy = medicalHistory.allergies.find((allergy) => {
      if (allergy._id) {
        const allergyIdStr = allergy._id.toString();
        const paramIdStr = req.params.id.toString();
        return allergyIdStr === paramIdStr;
      }
      return false;
    });

    if (!allergy) {
      return res.status(404).json({ message: "Allergy not found" });
    }

    if (req.body.nameOfTheAllergy)
      allergy.nameOfTheAllergy = req.body.nameOfTheAllergy;
    if (req.body.details) allergy.details = req.body.details;
    if (req.body.moreDetails) allergy.moreDetails = req.body.moreDetails;
    if (req.body.treatedBy) allergy.treatedBy = req.body.treatedBy;
    if (req.body.dateOfFirstDiagnosis)
      allergy.dateOfFirstDiagnosis = req.body.dateOfFirstDiagnosis;
    if (req.body.medicine) allergy.medicine = req.body.medicine;
    if (req.body.notes) allergy.notes = req.body.notes;

    medicalHistory.markModified("allergies");

    await medicalHistory.save();

    res.status(200).json(allergy);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific allergy by ID
exports.deleteAllergy = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const allergyIndex = medicalHistory.allergies.findIndex((allergy) => {
      if (allergy._id) {
        return allergy._id.toString() === req.params.id;
      }
      return false;
    });

    if (allergyIndex === -1) {
      return res.status(404).json({ message: "Allergy not found" });
    }

    medicalHistory.allergies.splice(allergyIndex, 1);

    await medicalHistory.save();

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
