const express = require('express');
const router = express.Router();
const { assignPC, removePC, updatePCCategory } = require('../controllers/pcController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.put('/assign', assignPC);
router.put('/remove', removePC);
router.put('/category', updatePCCategory);

module.exports = router;
