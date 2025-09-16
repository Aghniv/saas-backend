const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Public routes
router.post('/login', authController.login);

// Protected routes
router.get('/profile', verifyToken, authController.getProfile);
router.post('/invite', verifyToken, isAdmin, authController.inviteUser);

module.exports = router;