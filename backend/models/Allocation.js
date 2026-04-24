const mongoose = require('mongoose');

const allocationSchema = new mongoose.Schema({
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    required: true
  },
  pc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PC',
    required: true
  },
  batch: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Batch',
    required: true
  }
}, { timestamps: true });

// Ensure a PC can only have one allocation per batch
allocationSchema.index({ pc: 1, batch: 1 }, { unique: true });

// Ensure a student can only have one allocation per batch
allocationSchema.index({ student: 1, batch: 1 }, { unique: true });

module.exports = mongoose.model('Allocation', allocationSchema);
