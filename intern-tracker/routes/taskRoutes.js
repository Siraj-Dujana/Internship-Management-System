const express = require('express');
const router = express.Router();
const { createTask, getAllTasks, getTaskById, updateTask, deleteTask } = require('../controllers/taskController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',      protect, adminOnly, createTask);
router.get('/',       protect, getAllTasks);
router.get('/:id',    protect, getTaskById);
router.put('/:id',    protect, updateTask);          // both admin & intern
router.delete('/:id', protect, adminOnly, deleteTask);

module.exports = router;
