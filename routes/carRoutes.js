// routes/carRoutes.js
const express = require('express');
const router = express.Router();
const carController = require('../controllers/carController');

router.post('/', carController.addCar);

module.exports = router;