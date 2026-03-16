const express = require('express');
const router = express.Router();
const { addProgress, getAllProgress, getProgressByIntern, updateProgress, deleteProgress } = require('../controllers/progressController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

router.post('/',                    protect, adminOnly, addProgress);
router.get('/',                     protect, getAllProgress);
router.get('/intern/:internId',     protect, adminOnly, getProgressByIntern);
router.put('/:id',                  protect, adminOnly, updateProgress);
router.delete('/:id',               protect, adminOnly, deleteProgress);

module.exports = router;
