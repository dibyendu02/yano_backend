const BloodPressure = require("../models/BloodPressure");

exports.addBloodPressure = async (req, res) => {
  const { userId, systolic, diastolic, unit } = req.body;

  try {
    const newRecord = new BloodPressure({ userId, systolic, diastolic, unit });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editBloodPressure = async (req, res) => {
  const { id } = req.params;
  const { systolic, diastolic, unit } = req.body;

  try {
    const updatedRecord = await BloodPressure.findByIdAndUpdate(
      id,
      { systolic, diastolic, unit },
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

exports.deleteBloodPressure = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecord = await BloodPressure.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
