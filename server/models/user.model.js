const { DataTypes } = require('sequelize');
const sequelize = require('../config/db.config');
const Tenant = require('./tenant.model');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('admin', 'member'),
    defaultValue: 'member',
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
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
});

// Define association
User.belongsTo(Tenant, { foreignKey: 'tenantId' });
Tenant.hasMany(User, { foreignKey: 'tenantId' });

module.exports = User;