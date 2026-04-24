const PC = require('../models/PC');
const Student = require('../models/Student');
const Allocation = require('../models/Allocation');
const ActivityLog = require('../models/ActivityLog');

// @desc    Assign PC to student in a batch
// @route   PUT /api/pc/assign
// @access  Private
const assignPC = async (req, res) => {
  const { pcId, studentId, batchId } = req.body;

  try {
    const pc = await PC.findById(pcId);
    const student = await Student.findById(studentId);

    if (!pc || !student) {
      return res.status(404).json({ message: 'PC or Student not found' });
    }

    // Check if PC is already assigned in this batch
    const existingPCAllocation = await Allocation.findOne({ pc: pcId, batch: batchId });
    if (existingPCAllocation) {
      return res.status(400).json({ message: 'PC is already allocated in this batch' });
    }

    // Check if Student is already assigned in this batch
    const existingStudentAllocation = await Allocation.findOne({ student: studentId, batch: batchId });
    if (existingStudentAllocation) {
      return res.status(400).json({ message: 'Student is already assigned to a PC in this batch' });
    }

    // Create allocation
    const allocation = await Allocation.create({
      pc: pcId,
      student: studentId,
      batch: batchId
    });

    // Log activity
    await ActivityLog.create({
      action: 'ALLOCATED',
      admin: req.admin._id,
      pc: pc._id,
      student: student._id,
      details: `Assigned PC ${pc.pcNumber} to ${student.name} for batch ${batchId}`
    });

    res.json({ message: 'PC assigned successfully', allocation });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Remove student from PC in a batch
// @route   PUT /api/pc/remove
// @access  Private
const removePC = async (req, res) => {
  const { pcId, batchId } = req.body;

  try {
    const allocation = await Allocation.findOne({ pc: pcId, batch: batchId }).populate('student');
    if (!allocation) {
      return res.status(404).json({ message: 'No allocation found for this PC in this batch' });
    }

    const studentName = allocation.student.name;
    const studentId = allocation.student._id;

    await Allocation.deleteOne({ _id: allocation._id });

    // Log activity
    await ActivityLog.create({
      action: 'DEALLOCATED',
      admin: req.admin._id,
      pc: pcId,
      student: studentId,
      details: `Removed ${studentName} from PC in batch ${batchId}`
    });

    res.json({ message: 'PC deallocated successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update PC category
// @route   PUT /api/pc/category
// @access  Private
const updatePCCategory = async (req, res) => {
  const { pcId, category } = req.body;
  try {
    const pc = await PC.findById(pcId);
    if (!pc) return res.status(404).json({ message: 'PC not found' });
    pc.category = category;
    await pc.save();
    res.json(pc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { assignPC, removePC, updatePCCategory };
