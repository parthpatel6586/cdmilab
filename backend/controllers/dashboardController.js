const Student = require('../models/Student');
const Lab = require('../models/Lab');
const PC = require('../models/PC');
const ActivityLog = require('../models/ActivityLog');
const Allocation = require('../models/Allocation');

// @desc    Get dashboard analytics
// @route   GET /api/dashboard/analytics
// @access  Private
const getAnalytics = async (req, res) => {
  try {
    const totalStudents = await Student.countDocuments({});
    const totalLabs = await Lab.countDocuments({});
    const totalPCs = await PC.countDocuments({});
    
    // For general analytics, we might want to know total unique students allocated across all batches
    const uniqueAllocatedStudents = await Allocation.distinct('student');
    const allocatedPCsCount = await Allocation.distinct('pc');

    const recentActivity = await ActivityLog.find({})
      .populate('admin', 'username')
      .populate('pc', 'pcNumber')
      .populate('student', 'name')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json({
      totalStudents,
      totalLabs,
      totalPCs,
      allocatedPCs: allocatedPCsCount.length,
      availablePCs: totalPCs - allocatedPCsCount.length, // This is a bit abstract across batches
      recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Export allocation report
// @route   GET /api/dashboard/export
// @access  Private
const exportReport = async (req, res) => {
  try {
    const allocations = await Allocation.find({})
      .populate({
        path: 'pc',
        populate: { path: 'lab', select: 'name' }
      })
      .populate('student', 'name studentId course batch hasLaptop')
      .populate('batch', 'name');

    let csv = 'Batch,Lab,PC Number,Category,Student Name,Student ID,Course,Batch(Year),Has Laptop\n';
    allocations.forEach(al => {
      csv += `${al.batch.name},${al.pc.lab.name},${al.pc.pcNumber},${al.pc.category},${al.student.name},${al.student.studentId},${al.student.course},${al.student.batch},${al.student.hasLaptop ? 'Yes' : 'No'}\n`;
    });

    res.header('Content-Type', 'text/csv');
    res.attachment('allocation-report-full.csv');
    res.send(csv);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getAnalytics, exportReport };
