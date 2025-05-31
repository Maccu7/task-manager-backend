const express = require('express');
const router = express.Router();
const Task = require('../models/task');
const auth = require('../middleware/auth');
const { createTaskValidation } = require('../validators/task.validator');
const validate = require('../middleware/validate');
const { Op } = require('sequelize');

// Get tasks for the authenticated user with filtering, sorting and pagination
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 10, isCompleted, sortBy, order = 'desc' } = req.query;
    const where = { userId: req.user.id };
    if (isCompleted !== undefined) {
      where.isCompleted = isCompleted === 'true';
    }
    const sort = [];
    if (sortBy) {
      sort.push([sortBy, order === 'desc' ? 'DESC' : 'ASC']);
    } else {
      sort.push(['createdAt', 'DESC']);
    }
    const { rows: tasks, count: total } = await Task.findAndCountAll({
      where,
      order: sort,
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
    });
    res.json({
      tasks,
      totalTasks: total,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit))
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Create a new task
router.post('/', auth, createTaskValidation, validate, async (req, res) => {
  try {
    const newTask = await Task.create({
      title: req.body.title,
      description: req.body.description,
      dueDate: req.body.dueDate,
      userId: req.user.id
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Update a task
router.patch('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    if (req.body.title != null) task.title = req.body.title;
    if (req.body.description != null) task.description = req.body.description;
    if (req.body.isCompleted != null) task.isCompleted = req.body.isCompleted;
    if (req.body.dueDate != null) task.dueDate = req.body.dueDate;
    await task.save();
    res.json(task);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete a task
router.delete('/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOne({ where: { id: req.params.id, userId: req.user.id } });
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    await task.destroy();
    res.json({ message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get task statistics
router.get('/stats', auth, async (req, res) => {
  try {
    const userId = req.user.id;
    const [total, completed, pending, dueSoon] = await Promise.all([
      Task.count({ where: { userId } }),
      Task.count({ where: { userId, isCompleted: true } }),
      Task.count({ where: { userId, isCompleted: false } }),
      Task.count({
        where: {
          userId,
          isCompleted: false,
          dueDate: { [Op.lte]: new Date(Date.now() + 24 * 60 * 60 * 1000) }
        }
      })
    ]);
    res.json({ total, completed, pending, dueSoon });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
