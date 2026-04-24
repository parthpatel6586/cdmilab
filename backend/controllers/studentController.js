const Student = require('../models/Student');
const Allocation = require('../models/Allocation');

// @desc    Get all students
// @route   GET /api/students
// @access  Private
const getStudents = async (req, res) => {
  try {
    const students = await Student.find({}).populate('batch').sort({ createdAt: -1 });
    res.json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new student
// @route   POST /api/students
// @access  Private
const createStudent = async (req, res) => {
  const { studentId, name, course, batch, hasLaptop } = req.body;

  try {
    const studentExists = await Student.findOne({ studentId });

    if (studentExists) {
      return res.status(400).json({ message: 'Student ID already exists' });
    }

    const student = await Student.create({
      studentId,
      name,
      course,
      batch,
      hasLaptop
    });

    res.status(201).json(student);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update student
// @route   PUT /api/students/:id
// @access  Private
const updateStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      student.name = req.body.name || student.name;
      student.course = req.body.course || student.course;
      student.batch = req.body.batch || student.batch;
      student.hasLaptop = req.body.hasLaptop !== undefined ? req.body.hasLaptop : student.hasLaptop;

      const updatedStudent = await student.save();
      res.json(updatedStudent);
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete student
// @route   DELETE /api/students/:id
// @access  Private
const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (student) {
      // Check if student has any active PC allocations
      const hasAllocation = await Allocation.findOne({ student: req.params.id });
      
      if (hasAllocation) {
        return res.status(400).json({ message: 'Cannot delete student assigned to a PC. Please free the PC first.' });
      }

      await Student.deleteOne({ _id: req.params.id });
      res.json({ message: 'Student removed' });
    } else {
      res.status(404).json({ message: 'Student not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getStudents, createStudent, updateStudent, deleteStudent };
