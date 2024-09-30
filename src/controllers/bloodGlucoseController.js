const BloodGlucose = require("../models/BloodGlucose");

// Add a new blood glucose record
exports.addBloodGlucose = async (req, res) => {
  const { userId, age, data, unit, foodConsumed, note } = req.body;

  try {
    const newRecord = new BloodGlucose({
      userId,
      age,
      data,
      unit,
      foodConsumed,
      note,
    });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all blood glucose records
exports.getAllBloodGlucoseRecords = async (req, res) => {
  try {
    const records = await BloodGlucose.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get all blood glucose records for a specific user
exports.getBloodGlucoseByUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const records = await BloodGlucose.find({ userId });
    if (!records || records.length === 0) {
      return res
        .status(404)
        .json({ message: "No records found for this user" });
    }
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Edit an existing blood glucose record
exports.editBloodGlucose = async (req, res) => {
  const { id } = req.params;
  const { data, unit, foodConsumed, note } = req.body;

  try {
    const updatedRecord = await BloodGlucose.findByIdAndUpdate(
      id,
      { data, unit, foodConsumed, note },
      { new: true }
    );
    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(updatedRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Delete a blood glucose record
exports.deleteBloodGlucose = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecord = await BloodGlucose.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
