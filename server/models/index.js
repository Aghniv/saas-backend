const sequelize = require('../config/db.config');
const Tenant = require('./tenant.model');
const User = require('./user.model');
const Note = require('./note.model');

// Define all associations
Tenant.hasMany(User, { foreignKey: 'tenantId' });
User.belongsTo(Tenant, { foreignKey: 'tenantId' });

Tenant.hasMany(Note, { foreignKey: 'tenantId' });
Note.belongsTo(Tenant, { foreignKey: 'tenantId' });

User.hasMany(Note, { foreignKey: 'userId' });
Note.belongsTo(User, { foreignKey: 'userId' });

// Sync all models with database
const syncDatabase = async () => {
  try {
    await sequelize.sync({ alter: true });
    console.log('Database synchronized successfully');
  } catch (error) {
    console.error('Error synchronizing database:', error);
  }
};

module.exports = {
  sequelize,
  Tenant,
  User,
  Note,
  syncDatabase
};