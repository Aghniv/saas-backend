const { Sequelize } = require('sequelize');
const dotenv = require('dotenv');

dotenv.config();

// Create Sequelize instance
const sequelize = new Sequelize(
  process.env.DB_NAME || 'saas_notes_db',
  process.env.DB_USER || 'root',
  process.env.DB_PASSWORD || 'Ap#helium4',
  {
    host: process.env.DB_HOST || '127.0.0.1',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 5,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  }
);

// Test the connection
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

testConnection();

module.exports = sequelize;