const MedicalHistory = require("../../models/MedicalHistory");
const healthConditions = require("../../models/MedicalHistories/healthConditions");

// Create a new health condition
exports.createHealthCondition = async (req, res) => {
  try {
    console.log(req.body);

    const newHealthCondition = await healthConditions.create({
      nameOfTheHealthCondition: req.body.nameOfTheHealthCondition,
      dateOfDiagnosis: req.body.dateOfDiagnosis,
      status: req.body.status,
      treatedBy: req.body.treatedBy,
      medicine: req.body.medicine,
      additionalNotes: req.body.additionalNotes,
    });

    if (!newHealthCondition) {
      console.log("Health condition not created");
      return res.status(404).json({ message: "Health condition not created" });
    }

    const newCondition = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { healthConditions: newHealthCondition } },
      { new: true }
    );

    if (!newCondition) {
      return res.status(404).json({ message: "Medical history not created" });
    }

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
    const condition = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!condition) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const healthCondition = condition.healthConditions.find((condition) => {
      if (condition._id) {
        const conditionIdStr = condition._id.toString();
        const paramIdStr = req.params.id.toString();
        return conditionIdStr === paramIdStr;
      }
      return false;
    });

    if (!healthCondition) {
      return res.status(404).json({ message: "Health condition not found" });
    }

    res.status(200).json(healthCondition);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific health condition by ID
exports.updateHealthCondition = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const condition = medicalHistory.healthConditions.find((condition) => {
      if (condition._id) {
        const conditionIdStr = condition._id.toString();
        const paramIdStr = req.params.id.toString();
        return conditionIdStr === paramIdStr;
      }
      return false;
    });

    if (!condition) {
      return res.status(404).json({ message: "Health condition not found" });
    }

    // Update only the fields provided in the request
    if (req.body.nameOfTheHealthCondition !== undefined) {
      condition.nameOfTheHealthCondition = req.body.nameOfTheHealthCondition;
    }
    if (req.body.dateOfDiagnosis !== undefined) {
      condition.dateOfDiagnosis = req.body.dateOfDiagnosis;
    }
    if (req.body.status !== undefined) {
      condition.status = req.body.status;
    }
    if (req.body.treatedBy !== undefined) {
      condition.treatedBy = req.body.treatedBy; // Note: Ensure consistent camelCase
    }
    if (req.body.medicine !== undefined) {
      condition.medicine = req.body.medicine;
    }
    if (req.body.additionalNotes !== undefined) {
      condition.additionalNotes = req.body.additionalNotes;
    }

    medicalHistory.markModified("healthConditions");
    await medicalHistory.save();
    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific health condition by ID
exports.deleteHealthCondition = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const conditionIndex = medicalHistory.healthConditions.findIndex(
      (condition) => {
        if (condition._id) {
          return condition._id.toString() === req.params.id;
        }
        return false;
      }
    );

    if (conditionIndex === -1) {
      return res.status(404).json({ message: "Health condition not found" });
    }

    medicalHistory.healthConditions.splice(conditionIndex, 1);

    await medicalHistory.save();

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
