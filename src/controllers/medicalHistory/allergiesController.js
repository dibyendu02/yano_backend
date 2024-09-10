const Allergies = require("../../models/MedicalHistories/allergies");
const MedicalHistory = require("../../models/MedicalHistory");

// Create a new allergy
exports.createAllergy = async (req, res) => {
  try {
    // Create the allergy entry
    const allergy = await Allergies.create({
      nameOfTheAllergy: req.body.nameOfTheAllergy,
      triggeredBy: req.body.triggeredBy,
      reaction: req.body.reaction,
      howOftenDoesItOccur: req.body.howOftenDoesItOccur,
      dateOfFirstDiagnosis: req.body.dateOfFirstDiagnosis,
      medicine: req.body.medicine,
      additionalNotes: req.body.additionalNotes,
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
    console.error(error);
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

    const allergy = medicalHistory.allergies.id(req.params.id);
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
    // Find the medical history for the user
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    // Find the allergy in the user's medical history
    const allergy = medicalHistory.allergies.find((allergy) => {
      if (allergy._id) {
        return allergy._id.toString() === req.params.id;
      }
      return false;
    });

    if (!allergy) {
      return res.status(404).json({ message: "Allergy not found" });
    }

    // Update the fields if they are provided in the request
    if (req.body.nameOfTheAllergy)
      allergy.nameOfTheAllergy = req.body.nameOfTheAllergy;
    if (req.body.triggeredBy) allergy.triggeredBy = req.body.triggeredBy;
    if (req.body.reaction) allergy.reaction = req.body.reaction;
    if (req.body.howOftenDoesItOccur)
      allergy.howOftenDoesItOccur = req.body.howOftenDoesItOccur;
    if (req.body.dateOfFirstDiagnosis)
      allergy.dateOfFirstDiagnosis = req.body.dateOfFirstDiagnosis;
    if (req.body.medicine) allergy.medicine = req.body.medicine;
    if (req.body.additionalNotes)
      allergy.additionalNotes = req.body.additionalNotes;

    // Mark the allergies array as modified
    medicalHistory.markModified("allergies");

    // Save the updated medical history
    await medicalHistory.save();

    // Respond with the updated allergy entry
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

    const allergyIndex = medicalHistory.allergies.findIndex(
      (allergy) => allergy._id.toString() === req.params.id
    );

    if (allergyIndex === -1) {
      return res.status(404).json({ message: "Allergy not found" });
    }

    medicalHistory.allergies.splice(allergyIndex, 1);

    await medicalHistory.save();

    res.status(200).json({ message: "Allergy deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
