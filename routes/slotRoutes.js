// routes/slotRoutes.js
const express = require('express');
const router = express.Router();
const slotController = require('../controllers/slotController');

router.post('/', slotController.addSlot);

module.exports = router;