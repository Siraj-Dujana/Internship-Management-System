const Task = require('../models/Task');

// @desc   Create a new task (admin assigns to intern)
// @route  POST /api/tasks
// @access Admin
const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, deadline, priority } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      assignedBy: req.user._id,
      deadline,
      priority,
    });

    res.status(201).json({ success: true, message: 'Task created', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all tasks (admin sees all, intern sees own)
// @route  GET /api/tasks
// @access Private
const getAllTasks = async (req, res) => {
  try {
    let tasks;

    if (req.user.role === 'admin') {
      tasks = await Task.find()
        .populate('assignedTo', 'name email')
        .populate('assignedBy', 'name');
    } else {
      tasks = await Task.find({ assignedTo: req.user._id })
        .populate('assignedBy', 'name');
    }

    res.json({ success: true, count: tasks.length, data: tasks });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get a single task
// @route  GET /api/tasks/:id
// @access Private
const getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('assignedTo', 'name email')
      .populate('assignedBy', 'name');

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    // Intern can only view their own tasks
    if (req.user.role === 'intern' && task.assignedTo._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this task' });
    }

    res.json({ success: true, data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update a task (admin updates details/feedback, intern submits work)
// @route  PUT /api/tasks/:id
// @access Private
const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    if (req.user.role === 'intern') {
      // Intern can only submit their own task
      if (task.assignedTo.toString() !== req.user._id.toString()) {
        return res.status(403).json({ success: false, message: 'Not authorized' });
      }
      task.submissionLink = req.body.submissionLink || task.submissionLink;
      task.submissionNote = req.body.submissionNote || task.submissionNote;
      task.status = 'submitted';
    } else {
      // Admin can update everything
      task.title       = req.body.title       || task.title;
      task.description = req.body.description || task.description;
      task.deadline    = req.body.deadline    || task.deadline;
      task.priority    = req.body.priority    || task.priority;
      task.status      = req.body.status      || task.status;
      task.adminFeedback = req.body.adminFeedback || task.adminFeedback;
    }

    await task.save();
    res.json({ success: true, message: 'Task updated', data: task });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete a task
// @route  DELETE /api/tasks/:id
// @access Admin
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }
    res.json({ success: true, message: 'Task deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { createTask, getAllTasks, getTaskById, updateTask, deleteTask };
