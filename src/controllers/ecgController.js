const ECG = require("../models/ECG");

exports.addECG = async (req, res) => {
  const { userId, age, data, unit } = req.body;

  try {
    const newRecord = new ECG({ userId, age, data, unit });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editECG = async (req, res) => {
  const { id } = req.params;
  const { data, unit } = req.body;

  try {
    const updatedRecord = await ECG.findByIdAndUpdate(
      id,
      { data, unit },
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

exports.deleteECG = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecord = await ECG.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
