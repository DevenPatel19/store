// routes/taskRoutes.js
const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const auth = require('../middleware/auth');

// Create task
router.post('/', auth, async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get all tasks for user
router.get('/', auth, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort('position');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Update task (position/column/content)
router.put('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Delete task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ 
      _id: req.params.id, 
      user: req.user.id 
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Clear completed tasks and send email
router.post('/complete', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const completedTasks = await Task.find({ 
      user: req.user.id, 
      column: 'done' 
    });
    
    // Send email (pseudo-code)
    // await sendCompletionEmail(user.email, completedTasks);
    
    // Delete completed tasks
    await Task.deleteMany({ 
      user: req.user.id, 
      column: 'done' 
    });
    
    res.json({ message: 'Completed tasks cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;