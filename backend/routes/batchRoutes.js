const express = require('express');
const router = express.Router();
const { getBatches, createBatch } = require('../controllers/batchController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getBatches)
  .post(createBatch);

module.exports = router;
