const express = require('express');
const router = express.Router();
const noteController = require('../controllers/note.controller');
const { verifyToken, enforceTenantIsolation } = require('../middleware/auth.middleware');
const { checkNotesLimit } = require('../middleware/subscription.middleware');

// All routes require authentication and tenant isolation
router.use(verifyToken);
router.use(enforceTenantIsolation);

// Notes CRUD routes
router.post('/notes', checkNotesLimit, noteController.createNote);
router.get('/notes', noteController.getAllNotes);
router.get('/notes/:id', noteController.getNoteById);
router.put('/notes/:id', noteController.updateNote);
router.delete('/notes/:id', noteController.deleteNote);

module.exports = router;