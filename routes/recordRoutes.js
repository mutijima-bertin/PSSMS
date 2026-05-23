// routes/recordRoutes.js
const express = require('express');
const router = express.Router();
const recordController = require('../controllers/recordController');

router.post('/entry', recordController.createRecord); // Insert
router.get('/', recordController.getAllRecords);       // Retrieve
router.put('/exit', recordController.exitCar);         // Update (processes billing and exit status)
router.delete('/:id', recordController.deleteRecord);  // Delete

module.exports = router;