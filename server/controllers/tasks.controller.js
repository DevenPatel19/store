// controllers/taskController.js
import Task from '../models/Tasks.model.js';
import User from '../models/User.model.js';

// Create Task
export const createTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, user: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// Get All Tasks for User
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.user.id }).sort('position');
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Update Task
export const updateTask = async (req, res) => {
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
};

// Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });
    if (!task) return res.status(404).json({ error: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

// Clear completed tasks
export const clearCompletedTasks = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const completedTasks = await Task.find({
      user: req.user.id,
      column: 'done',
    });

    // Optionally send an email here

    await Task.deleteMany({
      user: req.user.id,
      column: 'done',
    });

    res.json({ message: 'Completed tasks cleared' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};
