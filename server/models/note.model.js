const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Tenant = require('./tenant.model');
const User = require('./user.model');

const Note = sequelize.define('Note', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tenantId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Tenant,
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define associations
Note.belongsTo(Tenant, { foreignKey: 'tenantId' });
Tenant.hasMany(Note, { foreignKey: 'tenantId' });

Note.belongsTo(User, { foreignKey: 'userId' });
User.hasMany(Note, { foreignKey: 'userId' });

module.exports = Note;