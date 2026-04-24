const express = require('express');
const router = express.Router();
const { getLabs, createLab, getLabById } = require('../controllers/labController');
const { protect } = require('../middleware/authMiddleware');

router.use(protect);

router.route('/')
  .get(getLabs)
  .post(createLab);

router.get('/:id', getLabById);

module.exports = router;
