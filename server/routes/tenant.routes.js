const express = require('express');
const router = express.Router();
const tenantController = require('../controllers/tenant.controller');
const { verifyToken, isAdmin } = require('../middleware/auth.middleware');

// Protected routes
router.get('/tenants/:slug', verifyToken, tenantController.getTenantBySlug);
router.post('/tenants/:slug/upgrade', verifyToken, isAdmin, tenantController.upgradeToPro);

module.exports = router;