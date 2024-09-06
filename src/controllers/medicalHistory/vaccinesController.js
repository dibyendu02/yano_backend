const vaccine = require("../../models/MedicalHistories/vaccine");
const MedicalHistory = require("../../models/MedicalHistory");

// Create a new vaccine record
exports.createVaccine = async (req, res) => {
  try {
    const newVaccine = await vaccine.create({
      vaccineFor: req.body.vaccineFor,
      shotDate: req.body.shotDate,
      vaccineName: req.body.vaccineName,
      vaccineDetails: req.body.vaccineDetails,
      lotNumber: req.body.lotNumber,
      additionalNotes: req.body.additionalNotes,
    });
    const medicalHistory = await MedicalHistory.findOneAndUpdate(
      { userId: req.body.userId },
      { $push: { vaccines: newVaccine } },
      { new: true }
    );

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }
    res.status(201).json(medicalHistory);
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
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const vaccine = medicalHistory.vaccines.find((vaccine) => {
      if (vaccine._id) {
        const vaccineIdStr = vaccine._id.toString();
        const paramIdStr = req.params.id.toString();
        return vaccineIdStr === paramIdStr;
      }
      return false;
    });

    if (!vaccine) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    res.status(200).json(vaccine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update a specific vaccine record by ID
exports.updateVaccine = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const vaccine = medicalHistory.vaccines.find((vaccine) => {
      if (vaccine._id) {
        const vaccineIdStr = vaccine._id.toString();
        const paramIdStr = req.params.id.toString();
        return vaccineIdStr === paramIdStr;
      }
      return false;
    });

    if (!vaccine) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    // Update only the fields provided in the request body
    if (req.body.vaccineFor) vaccine.vaccineFor = req.body.vaccineFor;
    if (req.body.shotDate) vaccine.shotDate = req.body.shotDate;
    if (req.body.vaccineName) vaccine.vaccineName = req.body.vaccineName;
    if (req.body.vaccineDetails)
      vaccine.vaccineDetails = req.body.vaccineDetails;
    if (req.body.lotNumber) vaccine.lotNumber = req.body.lotNumber;
    if (req.body.additionalNotes)
      vaccine.additionalNotes = req.body.additionalNotes;

    medicalHistory.markModified("vaccines");

    await medicalHistory.save();

    res.status(200).json(vaccine);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a specific vaccine record by ID
exports.deleteVaccine = async (req, res) => {
  try {
    const medicalHistory = await MedicalHistory.findOne({
      userId: req.params.userId,
    });

    if (!medicalHistory) {
      return res.status(404).json({ message: "Medical history not found" });
    }

    const vaccineIndex = medicalHistory.vaccines.findIndex((vaccine) => {
      if (vaccine._id) {
        return vaccine._id.toString() === req.params.id;
      }
      return false;
    });

    if (vaccineIndex === -1) {
      return res.status(404).json({ message: "Vaccine not found" });
    }

    medicalHistory.vaccines.splice(vaccineIndex, 1);

    await medicalHistory.save();

    res.status(200).json(medicalHistory);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
