const mongoose = require('mongoose');

const labSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  description: {
    type: String,
    trim: true
  },
  totalPCs: {
    type: Number,
    default: 25
  }
}, { timestamps: true });

module.exports = mongoose.model('Lab', labSchema);
