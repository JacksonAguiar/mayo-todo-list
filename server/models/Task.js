const mongoose = require('mongoose');

const TaskSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  status: {
    type: String,
    enum: ['pending', 'complete'],
    default: 'pending'
  }
});

module.exports = mongoose.model('Task', TaskSchema);
