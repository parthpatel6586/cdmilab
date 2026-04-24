const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
  action: {
    type: String,
    required: true,
    enum: ['ALLOCATED', 'DEALLOCATED', 'MAINTENANCE_START', 'MAINTENANCE_END']
  },
  admin: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true
  },
  pc: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'PC',
    required: true
  },
  student: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Student',
    default: null
  },
  details: {
    type: String,
    trim: true
  }
}, { timestamps: true });

module.exports = mongoose.model('ActivityLog', activityLogSchema);
