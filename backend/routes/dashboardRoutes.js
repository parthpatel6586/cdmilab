const express = require('express');
const router = express.Router();
const { getAnalytics, exportReport } = require('../controllers/dashboardController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.get('/analytics', getAnalytics);
router.get('/export', exportReport);

module.exports = router;
