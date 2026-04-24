const mongoose = require('mongoose');

const pcSchema = new mongoose.Schema({
  pcNumber: {
    type: Number,
    required: true
  },
  lab: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Lab',
    required: true
  },
  category: {
    type: String,
    enum: ['Design', 'Development', 'Laptop'],
    default: 'Development'
  }
}, { timestamps: true });

// Ensure pcNumber is unique within a lab
pcSchema.index({ pcNumber: 1, lab: 1 }, { unique: true });

module.exports = mongoose.model('PC', pcSchema);
