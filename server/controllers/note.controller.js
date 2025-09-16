const { Note } = require('../models');

// Create a new note
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    
    // Create note with current user's tenant ID
    const note = await Note.create({
      title,
      content,
      userId: req.user.id,
      tenantId: req.user.tenantId
    });
    
    res.status(201).json({
      message: 'Note created successfully',
      note
    });
  } catch (error) {
    console.error('Create note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all notes for current tenant
const getAllNotes = async (req, res) => {
  try {
    // Get all notes for current user's tenant
    const notes = await Note.findAll({
      where: { tenantId: req.user.tenantId },
      order: [['createdAt', 'DESC']]
    });
    
    res.status(200).json({ notes });
  } catch (error) {
    console.error('Get all notes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find note by ID
    const note = await Note.findByPk(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user's tenant
    if (note.tenantId !== req.user.tenantId) {
      return res.status(403).json({ message: 'Access denied to this note' });
    }
    
    res.status(200).json({ note });
  } catch (error) {
    console.error('Get note by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update note
const updateNote = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, content } = req.body;
    
    // Find note by ID
    const note = await Note.findByPk(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user's tenant
    if (note.tenantId !== req.user.tenantId) {
      return res.status(403).json({ message: 'Access denied to this note' });
    }
    
    // Update note
    await note.update({
      title: title || note.title,
      content: content || note.content
    });
    
    res.status(200).json({
      message: 'Note updated successfully',
      note
    });
  } catch (error) {
    console.error('Update note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find note by ID
    const note = await Note.findByPk(id);
    
    if (!note) {
      return res.status(404).json({ message: 'Note not found' });
    }
    
    // Check if note belongs to user's tenant
    if (note.tenantId !== req.user.tenantId) {
      return res.status(403).json({ message: 'Access denied to this note' });
    }
    
    // Delete note
    await note.destroy();
    
    res.status(200).json({ message: 'Note deleted successfully' });
  } catch (error) {
    console.error('Delete note error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  updateNote,
  deleteNote
};