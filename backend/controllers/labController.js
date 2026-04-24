const Lab = require('../models/Lab');
const PC = require('../models/PC');
const Allocation = require('../models/Allocation');

// @desc    Get all labs
// @route   GET /api/labs
// @access  Private
const getLabs = async (req, res) => {
  try {
    const labs = await Lab.find({});
    res.json(labs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a lab
// @route   POST /api/labs
// @access  Private
const createLab = async (req, res) => {
  const { name, description, totalPCs } = req.body;

  try {
    const labExists = await Lab.findOne({ name });

    if (labExists) {
      return res.status(400).json({ message: 'Lab name already exists' });
    }

    const lab = await Lab.create({
      name,
      description,
      totalPCs: totalPCs || 25
    });

    // Automatically create PCs for the lab
    const pcs = [];
    for (let i = 1; i <= lab.totalPCs; i++) {
      pcs.push({
        pcNumber: i,
        lab: lab._id,
        category: 'Development'
      });
    }
    await PC.insertMany(pcs);

    res.status(201).json(lab);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get lab by ID with PCs and allocations for a batch
// @route   GET /api/labs/:id
// @access  Private
const getLabById = async (req, res) => {
  const { batchId } = req.query;
  try {
    const lab = await Lab.findById(req.params.id);
    if (!lab) return res.status(404).json({ message: 'Lab not found' });

    const pcs = await PC.find({ lab: lab._id }).sort({ pcNumber: 1 });
    
    let allocations = [];
    if (batchId) {
      allocations = await Allocation.find({ batch: batchId, pc: { $in: pcs.map(p => p._id) } })
        .populate('student', 'name studentId course batch hasLaptop');
    }

    res.json({ lab, pcs, allocations });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getLabs, createLab, getLabById };
