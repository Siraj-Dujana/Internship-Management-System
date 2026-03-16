const express = require('express');
const router = express.Router();
const { getAllInterns, getInternById, updateIntern, deleteIntern } = require('../controllers/internController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.get('/',     protect, adminOnly, getAllInterns);
router.get('/:id',  protect, adminOnly, getInternById);
router.put('/:id',  protect, adminOnly, updateIntern);
router.delete('/:id', protect, adminOnly, deleteIntern);

module.exports = router;
