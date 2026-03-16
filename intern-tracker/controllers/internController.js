const User = require('../models/User');

// @desc   Get all interns
// @route  GET /api/interns
// @access Admin
const getAllInterns = async (req, res) => {
  try {
    const interns = await User.find({ role: 'intern' }).select('-password');
    res.json({ success: true, count: interns.length, data: interns });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Get single intern by ID
// @route  GET /api/interns/:id
// @access Admin
const getInternById = async (req, res) => {
  try {
    const intern = await User.findOne({ _id: req.params.id, role: 'intern' }).select('-password');
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }
    res.json({ success: true, data: intern });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Update intern profile
// @route  PUT /api/interns/:id
// @access Admin
const updateIntern = async (req, res) => {
  try {
    const { name, email, department, startDate, endDate, isActive } = req.body;

    const intern = await User.findByIdAndUpdate(
      req.params.id,
      { name, email, department, startDate, endDate, isActive },
      { new: true, runValidators: true }
    ).select('-password');

    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }

    res.json({ success: true, message: 'Intern updated', data: intern });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc   Delete intern
// @route  DELETE /api/interns/:id
// @access Admin
const deleteIntern = async (req, res) => {
  try {
    const intern = await User.findByIdAndDelete(req.params.id);
    if (!intern) {
      return res.status(404).json({ success: false, message: 'Intern not found' });
    }
    res.json({ success: true, message: 'Intern removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getAllInterns, getInternById, updateIntern, deleteIntern };
