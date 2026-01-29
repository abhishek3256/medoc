const express = require('express');
const router = express.Router();
const tokenController = require('../controllers/tokenController');

// Reuse tokenController's getSlotInfo
router.get('/:doctorId', tokenController.getSlotInfo);

module.exports = router;
