const MeasurementUnits = require("../models/MeasurementUnits"); // Adjust the path as necessary

// Create Measurement Unit for a user
const createMeasurementUnit = async (req, res) => {
  const { userId, temperature, weight, height, bloodGlucose } = req.body;

  try {
    const measurementUnit = new MeasurementUnits({
      userId,
      temperature,
      weight,
      height,
      bloodGlucose,
    });

    await measurementUnit.save();
    res.status(201).json({
      message: "Measurement unit created successfully",
      measurementUnit,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Update Measurement Unit by userId
const updateMeasurementUnit = async (req, res) => {
  const { userId } = req.params;
  const { temperature, weight, height, bloodGlucose } = req.body;

  try {
    const updatedUnit = await MeasurementUnits.findOneAndUpdate(
      { userId },
      { temperature, weight, height, bloodGlucose },
      { new: true, runValidators: true }
    );

    if (!updatedUnit) {
      return res.status(404).json({ message: "Measurement unit not found" });
    }

    res.status(200).json({ message: "Measurement unit updated", updatedUnit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

// Get Measurement Unit by userId
const getMeasurementUnitByUserId = async (req, res) => {
  const { userId } = req.params;

  try {
    const measurementUnit = await MeasurementUnits.findOne({ userId });

    if (!measurementUnit) {
      return res.status(404).json({ message: "Measurement unit not found" });
    }

    res.status(200).json({ measurementUnit });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = {
  createMeasurementUnit,
  updateMeasurementUnit,
  getMeasurementUnitByUserId,
};
