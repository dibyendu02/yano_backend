const socialHistory = require("../../models/MedicalHistories/socialHistory");
const MedicalHistory = require("../../models/MedicalHistory");

// Create a new social history entry
exports.createSocialHistory = async (req, res) => {
  try {
    const personsSocialHistory = await socialHistory.create({
      occupation: req.body?.occupation,
      education: req.body?.education,
      placeOfBirth: req.body?.placeOfBirth,
      maritalStatus: req.body?.maritalStatus,
      numberOfChildren: req.body?.numberOfChildren,
      religion: req.body?.religion,
      diet: req.body?.diet,
      sexualOrientation: req.body?.sexualOrientation,
      doYouSmoke: req.body?.doYouSmoke,
      doYouConsumeAlcohol: req.body?.doYouConsumeAlcohol,
      useOfOtherSubstances: req.body?.useOfOtherSubstances,
      doYouExercise: req.body?.doYouExercise,
      stressFactor: req.body?.stressFactor,
      spokenLanguage: req.body?.spokenLanguage,
    });
    const newEntry = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { socialHistory: personsSocialHistory } },
      { new: true }
    );
    if (!newEntry) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(201).json(newEntry);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: error.message });
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
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const socialHistory = medicalHistory.socialHistory.find((entry) => {
      if (entry._id) {
        const socialHistoryIdStr = entry._id.toString();
        const paramIdStr = req.params.id.toString();
        return socialHistoryIdStr === paramIdStr;
      }
      return false;
    });

    if (!socialHistory) {
      return res
        .status(404)
        .json({ message: "Social history entry not found" });
    }

    res.status(200).json(socialHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific social history entry by ID
exports.updateSocialHistory = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const socialHistory = medicalHistory.socialHistory.find((entry) => {
      if (entry._id) {
        const socialHistoryIdStr = entry._id.toString();
        const paramIdStr = req.params.id.toString();
        return socialHistoryIdStr === paramIdStr;
      }
      return false;
    });

    if (!socialHistory) {
      return res
        .status(404)
        .json({ message: "Social history entry not found" });
    }

    // Update only the fields provided in the request body
    if (req.body.occupation) socialHistory.occupation = req.body.occupation;
    if (req.body.education) socialHistory.education = req.body.education;
    if (req.body.placeOfBirth)
      socialHistory.placeOfBirth = req.body.placeOfBirth;
    if (req.body.maritalStatus)
      socialHistory.maritalStatus = req.body.maritalStatus;
    if (req.body.numberOfChildren !== undefined)
      socialHistory.numberOfChildren = req.body.numberOfChildren;
    if (req.body.religion) socialHistory.religion = req.body.religion;
    if (req.body.diet) socialHistory.diet = req.body.diet;
    if (req.body.sexualOrientation)
      socialHistory.sexualOrientation = req.body.sexualOrientation;
    if (req.body.doYouSmoke !== undefined)
      socialHistory.doYouSmoke = req.body.doYouSmoke;
    if (req.body.doYouConsumeAlcohol !== undefined)
      socialHistory.doYouConsumeAlcohol = req.body.doYouConsumeAlcohol;
    if (req.body.useOfOtherSubstances)
      socialHistory.useOfOtherSubstances = req.body.useOfOtherSubstances;
    if (req.body.doYouExercise)
      socialHistory.doYouExercise = req.body.doYouExercise;
    if (req.body.stressFactor)
      socialHistory.stressFactor = req.body.stressFactor;
    if (req.body.spokenLanguage)
      socialHistory.spokenLanguage = req.body.spokenLanguage;

    medicalHistory.markModified("socialHistory");

    await medicalHistory.save();

    res.status(200).json(socialHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific social history entry by ID
exports.deleteSocialHistory = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const socialHistoryIndex = medicalHistory.socialHistory.findIndex(
      (entry) => {
        if (entry._id) {
          return entry._id.toString() === req.params.id;
        }
        return false;
      }
    );

    if (socialHistoryIndex === -1) {
      return res
        .status(404)
        .json({ message: "Social history entry not found" });
    }

    medicalHistory.socialHistory.splice(socialHistoryIndex, 1);

    await medicalHistory.save();

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
