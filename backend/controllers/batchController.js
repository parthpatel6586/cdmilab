const Batch = require('../models/Batch');

// @desc    Get all batches
// @route   GET /api/batches
// @access  Private
const getBatches = async (req, res) => {
  try {
    const batches = await Batch.find({});
    res.json(batches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a batch
// @route   POST /api/batches
// @access  Private
const createBatch = async (req, res) => {
  const { name, startTime, endTime } = req.body;
  try {
    const batch = await Batch.create({ name, startTime, endTime });
    res.status(201).json(batch);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getBatches, createBatch };
