const HeartRate = require("../models/HeartRate");

exports.addHeartRate = async (req, res) => {
  const { userId, data, unit } = req.body;

  try {
    const newRecord = new HeartRate({ userId, data, unit });
    await newRecord.save();
    res.status(201).json(newRecord);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.editHeartRate = async (req, res) => {
  const { id } = req.params;
  const { data, unit } = req.body;

  try {
    const updatedRecord = await HeartRate.findByIdAndUpdate(
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

exports.deleteHeartRate = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedRecord = await HeartRate.findByIdAndDelete(id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
