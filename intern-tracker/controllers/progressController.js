const Progress = require('../models/Progress');

// @desc   Add a weekly progress record (admin)
// @route  POST /api/progress
// @access Admin
const addProgress = async (req, res) => {
  try {
    const { intern, week, totalTasks, completedTasks, score, adminNote } = req.body;

    const progress = await Progress.create({
      intern,
      week,
      totalTasks,
      completedTasks,
      score,
      adminNote,
      recordedBy: req.user._id,
    });

    res.status(201).json({ success: true, message: 'Progress recorded', data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get all progress records (admin) or own records (intern)
// @route  GET /api/progress
// @access Private
const getAllProgress = async (req, res) => {
  try {
    let records;

    if (req.user.role === 'admin') {
      records = await Progress.find()
        .populate('intern', 'name email')
        .populate('recordedBy', 'name');
    } else {
      records = await Progress.find({ intern: req.user._id });
    }

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get progress for a specific intern
// @route  GET /api/progress/intern/:internId
// @access Admin
const getProgressByIntern = async (req, res) => {
  try {
    const records = await Progress.find({ intern: req.params.internId })
      .populate('intern', 'name email')
      .sort({ week: 1 });

    res.json({ success: true, count: records.length, data: records });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update a progress record
// @route  PUT /api/progress/:id
// @access Admin
const updateProgress = async (req, res) => {
  try {
    const record = await Progress.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }

    res.json({ success: true, message: 'Progress updated', data: record });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete a progress record
// @route  DELETE /api/progress/:id
// @access Admin
const deleteProgress = async (req, res) => {
  try {
    const record = await Progress.findByIdAndDelete(req.params.id);
    if (!record) {
      return res.status(404).json({ success: false, message: 'Record not found' });
    }
    res.json({ success: true, message: 'Progress record deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { addProgress, getAllProgress, getProgressByIntern, updateProgress, deleteProgress };
