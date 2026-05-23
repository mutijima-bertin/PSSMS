// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router.post('/login', authController.login);
router.get('/status', authController.checkStatus);
router.post('/logout', authController.logout);

module.exports = router;