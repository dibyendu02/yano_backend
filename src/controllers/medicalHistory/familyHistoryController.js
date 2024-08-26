const familyHistory = require("../../models/MedicalHistories/familyHistory");
const MedicalHistory = require("../../models/MedicalHistory");

// Create a new family history entry
exports.createFamilyHistory = async (req, res) => {
  try {
    console.log(req.body);
    // Create a new family history document
    const newFamilyHistory = await familyHistory.create({
      relationShip: req.body.relationship,
      healthCondition: req.body.healthCondition,
    });

    const newEntry = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { familyHistory: newFamilyHistory } },
      { new: true }
    );
    console.log(newEntry);

    res.status(201).json(newEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all family history entries for a user
exports.getFamilyHistories = async (req, res) => {
  try {
    const histories = await MedicalHistory.findOne({
      userId: req.params.userId,
    }).select("familyHistory");
    res.status(200).json(histories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get a specific family history entry by ID
exports.getFamilyHistoryById = async (req, res) => {
  try {
    const history = await MedicalHistory.findOne({ userId: req.params.userId });

    if (history.familyHistory.length === 0) {
      return res.status(404).json({ message: "Family history not found" });
    }

    const familyMember = history.familyHistory.filter(
      (entry) => entry._id.toString() === req.params.id?.toString()
    );

    res.status(200).json(familyMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific family history entry by ID
exports.updateFamilyHistory = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const familyMember = medicalHistory.familyHistory.find((member) => {
      if (member._id) {
        const memberIdStr = member._id.toString();
        const paramIdStr = req.params.id.toString();
        return memberIdStr === paramIdStr;
      }
      return false;
    });

    if (!familyMember) {
      return res.status(404).json({ message: "Family member not found" });
    }

    if (req.body.relationship)
      familyMember.relationShip = req.body.relationship;
    if (req.body.healthCondition)
      familyMember.healthCondition = req.body.healthCondition;

    medicalHistory.markModified("familyHistory");

    await medicalHistory.save();

    res.status(200).json(familyMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific family history entry by ID
exports.deleteFamilyHistory = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const initialLength = medicalHistory.familyHistory.length;

    // Remove the specific family history entry
    medicalHistory.familyHistory = medicalHistory.familyHistory.filter(
      (entry) => entry._id.toString() !== req.params.id?.toString()
    );

    if (medicalHistory.familyHistory.length === initialLength) {
      return res.status(404).json({ message: "Family member not found" });
    }

    await medicalHistory.save();

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
