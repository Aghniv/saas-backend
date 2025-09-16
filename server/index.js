const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { sequelize, syncDatabase } = require('./models');

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Initialize database connection
syncDatabase().catch(err => console.error('Database sync error:', err));

// Middleware
app.use(cors());
app.use(express.json());

// Import routes
const authRoutes = require('./routes/auth.routes');
const noteRoutes = require('./routes/note.routes');
const tenantRoutes = require('./routes/tenant.routes');
const healthRoutes = require('./routes/health.routes');

// Use routes
app.use('/api', authRoutes);
app.use('/api', noteRoutes);
app.use('/api', tenantRoutes);
app.use('/api/health', healthRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});