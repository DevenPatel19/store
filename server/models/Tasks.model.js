// models/Task.js
const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
  content: { type: String, required: true },
  column: { 
    type: String, 
    enum: ['todo', 'in-progress', 'done'], 
    default: 'todo'
  },
  position: { type: Number, default: 0 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Task', taskSchema);